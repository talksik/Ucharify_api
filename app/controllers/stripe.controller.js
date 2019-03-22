const db = require('../../models'),
	errorMaker = require('../helpers/error.maker'),
	https = require('https');

const stripe = require('stripe')(process.env.STRIPE_KEY);

const { Donor, Charge, PaymentPlan } = db;

// Subscribe user to plan or one time charge
exports.grantCharge = async ({
	grant,
	stripeToken,
	organizations,
	monthly,
	amount,
	user
}) => {
	const grant_id = await grant.id;

	try {
		const donors = await Donor.findAll({ where: { id: user.id } });

		var result;

		const stripeAmount = amount * 100;

		// charge if yes or no monthly
		let charge = await stripe.charges.create({
			amount: stripeAmount,
			currency: 'usd',
			source: 'tok_visa',
			description: `Charity Bundle Payment`,
			statement_descriptor: `charity bundle ${grant.id}`,
			receipt_email: 'arjun@ucharify.com'
		});

		let transfers = await organizations.map(async org => {
			let stripeOrgAmount = Math.round(org.amount * 100);
			const applicationStripeFee = stripeOrgAmount * 0.05;

			let t = await stripe.transfers.create({
				amount: stripeOrgAmount - applicationStripeFee,
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

		return null;
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

// allows the org to see their stripe account with their balance and payout to their bank
exports.getExpressUILink = async (req, res, next) => {
	// get connected stripe account id from db
	// createLoginLink with stripe function
	// return to frontend
};

// verify the charity after they filled out basic info for express ui
exports.activateStripeAccount = async (req, res, next) => {
	const { code } = req.query;
	console.log(req.query);

	try {
		var dataString = `client_secret=${
			process.env.STRIPE_KEY
		}&code=${code}&grant_type=authorization_code`;

		var options = {
			host: 'connect.stripe.com',
			path: '/oauth/token',
			method: 'POST',
			body: {
				client_secret: process.env.STRIPE_KEY,
				code,
				grant_type: 'authorization_code'
			}
		};

		// Set up the request
		const postRequest = new Promise((resolve, reject) => {
			https
				.request(options, function(res) {
					res.setEncoding('utf8');
					let body = '';
					res.on('data', data => {
						body += data;
					});
					res.on('end', () => {
						body = JSON.parse(body);
					});

					resolve(body);
				})
				.on('error', err => {
					console.log('Error: ' + err.message);
					reject(err);
				});
		});

		// store for current user, get user_id from the state param maybe?
		const stripeAccRes = await Promise.resolve(postRequest);
		console.log(stripeAccRes);

		return res.status(302).redirect('http://localhost:8081/org/main/banking');
	} catch (error) {
		next(error);
	}
};
