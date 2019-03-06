const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const stripe = require('stripe')('sk_test_n8NCvCFjD1xFhGiEq6SI8CXj');

const { Donor, Charge, PaymentPlan } = db;

// Subscribe user to plan or one time charge
exports.grantCharge = async (grant, req, res, next) => {
	const { stripeToken, monthly } = req.body;
	const grant_id = await grant.id;

	const amount = 100 * 100; //stripe standards

	const user = req.user;
	const product_id = 'prod_ER3jOog6QMX1GP',
		default_plan_id = 'default_plan'; // main Grants product

	try {
		const donors = await Donor.findAll({ where: { id: user.id } });

		// check if already a stripe customer
		let { stripe_id, subscription_id } = donors[0];

		// if (!stripe_id) {
		// 	const customer = await stripe.customers.create({
		// 		source: stripeToken,
		// 		email: user.email
		// 	});
		// 	stripe_id = await customer.id;

		// 	await Donor.update({ stripe_id }, { where: { id: user.id } });
		// }
		// TODO: if there is, then update with the given source

		var result;

		// charge if not monthly, plan if it is
		if (!monthly) {
			let charge = await stripe.charges.create({
				amount,
				currency: 'usd',
				source: 'tok_visa',
				description: 'One time payment for grant',
				statement_descriptor: 'one-time-grant'
			});

			await stripe.transfers.create({
				amount: amount - 1000,
				currency: 'usd',
				source_transaction: charge.id,
				destination: 'acct_1EAxzUIVW1uo07uH'
			});

			await Charge.create({
				id: charge.id,
				amount,
				description: 'One time payment for grant'
			});

			result = charge;
		} else {
			const plan = await stripe.plans.create({
				nickname: `Plan for grant: ${grant_id}`,
				product: product_id,
				currency: 'usd',
				interval: 'month',
				amount
			});

			// either create new sub with new plan, or append plan to existing sub
			if (!subscription_id) {
				const currDate = new Date();
				const unixFirstNextMonth = Math.round(
					new Date(
						currDate.getFullYear(),
						currDate.getMonth() + 1,
						1
					).getTime() / 1000
				);

				let subscription = await stripe.subscriptions.create({
					customer: stripe_id,
					items: [{ plan: default_plan_id }],
					billing_cycle_anchor: unixFirstNextMonth,
					trial_end: unixFirstNextMonth
				});

				subscription_id = subscription.id;

				await Donor.update(
					{ subscription_id: subscription.id },
					{ where: { id: user.id } }
				);
			}

			const sub_item = await stripe.subscriptionItems.create({
				subscription: subscription_id,
				plan: plan.id
			});

			result = await PaymentPlan.create({
				plan_id: plan.id,
				amount,
				grant_id,
				subscription_id,
				sub_item_id: sub_item.id
			});
		}

		return res.status(200).json({
			message: 'Successfully charged or subscribed',
			grant
		});
	} catch (error) {
		next(error);
	}
};

// Delete grant's stripe plan under subscription
exports.deleteGrant = async (req, res, next) => {
	const { grant_id } = req.body;

	try {
		const paymentPlans = await PaymentPlan.findAll({ where: { grant_id } });

		// check if there are plans for that grant
		if (!paymentPlans.length) {
			return res.status(400).json({
				message: 'Not a valid grant'
			});
		} else {
			const plan = paymentPlans[0];

			//delete the plan/grant under the subscription for the user
			await stripe.subscriptionItems.del(plan.sub_item_id);
			//delete the plan from the main product 'Grants'
			await stripe.plans.del(plan.plan_id);
		}

		next();
	} catch (error) {
		next(error);
	}
};
