const db = require('../config/db.config.js'),
	errorMaker = require('../helpers/error.maker');

const stripe = require('stripe')('sk_test_n8NCvCFjD1xFhGiEq6SI8CXj');

const { Donor, Organization } = db;

// Subscribe user to plan or one time charge
exports.grantCharge = async (req, res, next) => {
	const { stripeToken, amount, monthly } = req.body;
	console.log(req.body);

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
