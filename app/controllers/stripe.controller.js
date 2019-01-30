const db = require('../config/db.config.js'),
	errorMaker = require('../helpers/error.maker');

const stripe = require('stripe')('sk_test_n8NCvCFjD1xFhGiEq6SI8CXj');

const { Donor, Organization } = db;

// Subscribe user to plan or one time charge
exports.grantCharge = (req, res, next) => {
	const { stripeToken, amount, monthly } = req.body;
	const user = req.user;

	findStripeId(user.id)
		.then(stripeId => {
			if (!stripeId) {
				return stripe.customers
					.create({
						source: stripeToken,
						email: user.email
					})
					.then(customer => {
						Donor.update(
							{ stripe_id: customer.id },
							{ where: { id: user.id } }
						);
						return customer.id;
					});
			}
			return stripeId;
		})
		.then(stripeId => {
			// return stripe.charges.create({
			// 	amount,
			// 	currency: 'usd',
			// 	customer: stripeId
			// });s
			stripe.plans
				.create({
					product: 'prod_CbvTFuXWh7BPJH',
					currency: 'usd',
					interval: 'month',
					amount: 10000
				})
				.then();
		})
		.then(chargeResponse => {
			res.status(200).json(chargeResponse);
		})
		.catch(error => next(error));
	// if (!monthly) {
	// 	const charge = stripe.charges.create({
	// 		amount,
	// 		currency: 'usd',
	// 		description: 'One time payment for grant',
	// 		source: stripeToken,
	// 		statement_descriptor: 'One time payment for grant'
	// 	});
	// }
};

const findStripeId = userId => {
	return new Promise((resolve, reject) => {
		Donor.findAll({ where: { id: userId } })
			.then(donors => {
				// add stripe id for
				// if (donors[0]) {
				// 	return next(errorMaker(409, `Email Exists: ${req.body.email}`));
				// }
				resolve(donors[0].stripe_id);
			})
			.catch(error => reject(error));
	});
};
