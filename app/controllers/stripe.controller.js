const db = require('../config/db.config.js'),
	errorMaker = require('../helpers/error.maker');

const stripe = require('stripe')('sk_test_n8NCvCFjD1xFhGiEq6SI8CXj');

const { Donor, Charge, PaymentPlan } = db;

// Subscribe user to plan or one time charge
exports.grantCharge = async (req, res, next) => {
	const { stripeToken, grant_id, amount, monthly } = req.body;
	const user = req.user;
	const product_id = 'prod_ER3jOog6QMX1GP';

	try {
		const donors = await Donor.findAll({ where: { id: user.id } });

		// check if already a stripe customer
		let { stripe_id, subscription_id } = donors[0];
		console.log(stripeToken);

		if (!stripe_id) {
			const customer = await stripe.customers.create({
				source: stripeToken,
				email: user.email
			});
			stripe_id = await customer.id;

			await Donor.update({ stripe_id }, { where: { id: user.id } });
		}
		// TODO: if there is, then update with the given source

		var result;

		// charge if not monthly, plan if it is
		if (!monthly) {
			let charge = await stripe.charges.create({
				amount,
				currency: 'usd',
				customer: stripe_id,
				description: 'One time payment for grant',
				statement_descriptor: 'one-time-grant'
			});

			await Charge.create({
				id: charge.id,
				amount,
				description: 'One time payment for grant'
			});

			result = charge;
		} else {
			const plan = await stripe.plans.create({
				id: grant_id,
				nickname: `Plan for grant: ${grant_id}`,
				product: product_id,
				currency: 'usd',
				interval: 'month',
				amount
			});

			// either create new sub with new plan, or append plan to existing sub
			if (!subscription_id) {
				let subscription = await stripe.subscriptions.create({
					customer: stripe_id,
					items: [{ plan: plan.id }]
				});

				await Donor.update(
					{ subscription_id: subscription.id },
					{ where: { id: user.id } }
				);
			} else
				await stripe.subscriptionItems.create({
					subscription: subscription_id,
					plan: plan.id
				});

			result = await PaymentPlan.create({
				plan_id: plan.id,
				amount,
				grant_id: grant_id
			});
		}

		res.status(200).json({
			message: 'Successfully charged or subscribed',
			result
		});
	} catch (error) {
		next(error);
	}
};
