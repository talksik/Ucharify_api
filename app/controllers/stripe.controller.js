const db = require('../config/db.config.js'),
	errorMaker = require('../helpers/error.maker');

const stripe = require('stripe')('sk_test_n8NCvCFjD1xFhGiEq6SI8CXj');

const { Donor, Organization, Charge, PaymentPlan } = db;

// Subscribe user to plan or one time charge
exports.grantCharge = async (req, res, next) => {
	const { stripeToken, grant_id, amount, monthly } = req.body;
	const user = req.user;

	// Donor.findAll({ where: { id: user.id } })
	// 	.then(donors => {
	// 		var { stripe_id, subscription_id } = donors[0];
	// 		req.subscription_id = subscription_id;
	// 		if (!stripe_id) {
	// 			stripe_id = stripe.customers
	// 				.create({
	// 					source: stripeToken,
	// 					email: user.email
	// 				})
	// 				.then(customer => customer.id)
	// 				.catch(error =>
	// 					next(errorMaker(500, "Couldn't create customer with source"))
	// 				);
	// 		}

	// 		return [stripe_id, subscription_id];
	// 	})
	// 	.then(([stripe_id, subscription_id]) => {
	// 		console.log(stripe_id, subscription_id);
	// 		if (!monthly) {
	// 			stripe.charges
	// 				.create({
	// 					amount,
	// 					currency: 'usd',
	// 					customer: stripe_id,
	// 					description: 'One time payment for grant',
	// 					statement_descriptor: 'One time payment for grant'
	// 				})
	// 				.then(chargeResponse => res.status(200).json(chargeResponse))
	// 				.catch(error => next(error));
	// 		} else {
	// 			stripe.plans
	// 				.create({
	// 					id: grant_id,
	// 					nickname: `Grant for user: ${user.id}`,
	// 					product: 'prod_ER3jOog6QMX1GP',
	// 					currency: 'usd',
	// 					interval: 'month',
	// 					amount
	// 				})
	// 				.then(plan => {
	// 					if (!req.subscription_id) {
	// 						stripe.subscriptions
	// 							.create({
	// 								customer: stripe_id,
	// 								items: [{ plan: plan.id }]
	// 							})
	// 							.then(sub =>
	// 								stripe.subscriptionItems
	// 									.create({
	// 										subscription: sub.id,
	// 										plan: plan.id
	// 									})
	// 									.catch(error => next(error))
	// 							)
	// 							.catch(error => next(error));
	// 					} else {
	// 						stripe.subscriptionItems
	// 							.create({
	// 								subscription: req.subscription_id,
	// 								plan: plan.id
	// 							})
	// 							.catch(error => next(error));
	// 					}

	// 					PaymentPlan.create({
	// 						plan_id: plan.id,
	// 						amount,
	// 						grant_id: grant_id
	// 					}).catch(error => next(error));
	// 				});
	// 		}
	// 	})
	// 	.catch(error => next(error));
	try {
		const donors = await Donor.findAll({ where: { id: user.id } });

		// check if already a stripe customer
		let { stripe_id, subscription_id } = donors[0];

		if (!stripe_id) {
			const customer = await stripe.customers.create({
				source: stripeToken,
				email: user.email
			});
			stripe_id = customer.id;

			await Donor.update({ stripe_id }, { where: { id: user.id } });
		}

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
				nickname: `Grant for grant: ${grant_id}`,
				product: 'prod_ER3jOog6QMX1GP',
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

		// let subscription_id = await (donors[0].subscription_id
		// 	? donors[0].subscription_id
		// 	: await stripe.subscriptions.create({
		// 			customer: customer_id,
		// 			items: [{ plan: 'Grant' }]
		// 	  }).id);

		// console.log(await customer_id);
		// await Donor.update(
		// 	{ stripe_id: customer_id, subscription_id },
		// 	{ where: { id: user.id } }
		// );

		// // charge if not monthly, plan if it is
		// if (!monthly) {
		// 	let charge = await stripe.charges.create({
		// 		amount,
		// 		currency: 'usd',
		// 		customer: customer_id,
		// 		description: 'One time payment for grant',
		// 		statement_descriptor: 'One time payment for grant'
		// 	});
		// 	await Charge.create({
		// 		id: charge.id,
		// 		amount,
		// 		description: 'One time payment for grant'
		// 	});
		// } else {
		// 	const plan = await stripe.plans.create({
		// 		id: grant_id,
		// 		nickname: `Grant for user: ${user.id}`,
		// 		product: 'prod_ER3jOog6QMX1GP',
		// 		currency: 'usd',
		// 		interval: 'month',
		// 		amount
		// 	});
		// 	await PaymentPlan.create({
		// 		plan_id: plan.id,
		// 		amount,
		// 		grant_id: grant_id
		// 	});
		// 	await stripe.subscriptionItems.create({
		// 		subscription: subscription_id,
		// 		plan: plan.id
		// 	});
		// }

		// res.status(200).json({
		// 	message: 'Successfully charged or subscribed'
		// });
	} catch (error) {
		next(error);
	}
};
