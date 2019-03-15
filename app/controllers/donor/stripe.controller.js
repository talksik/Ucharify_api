const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const stripe = require('stripe')(process.env.STRIPE_KEY);

const { Donor, Charge, PaymentPlan } = db;

// Subscribe user to plan or one time charge
exports.grantCharge = async (data, req, res) => {
	const { stripeToken, organizations, monthly, amount } = req.body;
	const { grant } = await data; // passed from grant controller
	const grant_id = await grant.id;

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

		// charge if yes or no monthly
		let charge = await stripe.charges.create({
			amount,
			currency: 'usd',
			source: 'tok_visa',
			description: 'One time payment for grant',
			statement_descriptor: 'one-time-grant'
		});

		let transfers = await organizations.map(async org => {
			org.amount = org.amount * 100;
			const applicationStripeFee = org.amount * 0.05;

			let t = await stripe.transfers.create({
				amount: org.amount - applicationStripeFee,
				currency: 'usd',
				source_transaction: charge.id,
				destination: 'acct_1EAxzUIVW1uo07uH'
			});
			return t;
		});

		await Charge.create({
			id: charge.id,
			amount,
			description: 'One time payment for grant'
		});

		result = charge;

		return res.status(200).json({
			message: 'Successfully charged or subscribed',
			grant
		});
	} catch (error) {
		throw error;
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
