const db = require('../../models'),
	errorMaker = require('../helpers/error.maker'),
	requestPromise = require('request-promise');

const stripe = require('stripe')(process.env.STRIPE_KEY);

const { Donor, Organization, Charge, PaymentPlan, sequelize } = db;

// Subscribe user to plan or one time charge
exports.grantCharge = async ({
	grant,
	stripeToken,
	organizations,
	monthly,
	amount,
	user
}) => {
	return new Promise(async (resolve, reject) => {
		const grant_id = await grant.id;

		try {
			const donors = await Donor.findAll({ where: { id: user.id } });

			const stripeAmount = amount * 100;

			// charge if yes or no monthly
			let charge = await stripe.charges.create({
				amount: stripeAmount,
				currency: 'usd',
				source: 'tok_visa',
				description: `Charity Bundle Payment`,
				statement_descriptor: `charity bundle ${grant.id}`,
				receipt_email: donors[0].email
			});

			let transfers = await organizations.map(async (org, index) => {
				const selectedOrgAmount = org.amount;
				// this determines how much Charify takes from each donation
				const stripeFee =
					Math.round((selectedOrgAmount * 0.029 + 0.3) * 1e2) / 1e2;
				org.amount = org.amount - stripeFee;

				const applicationFee =
					Math.round(selectedOrgAmount * 0.025 * 1e2) / 1e2;

				const applicationAndStripeFee = applicationFee + stripeFee;
				console.log(applicationAndStripeFee);
				let finalAmountToOrg = 0;

				let currOrg = await sequelize.query(
					`
					SELECT stripe_account_id, charify_credit FROM organizations
					WHERE id = :org_id`,
					{
						type: db.Sequelize.QueryTypes.SELECT,
						replacements: { org_id: org.id }
					}
				);

				if (currOrg[0].charify_credit) {
					let updated_amt = currOrg[0].charify_credit;

					if (currOrg[0].charify_credit < applicationAndStripeFee) {
						updated_amt = 0;
						// use up credit and take remaining as middle man
						finalAmountToOrg =
							selectedOrgAmount -
							applicationAndStripeFee +
							currOrg[0].charify_credit;
					} else {
						updated_amt = currOrg[0].charify_credit - applicationAndStripeFee;
						// take nothing as the middle man
						finalAmountToOrg = selectedOrgAmount;
					}

					await sequelize.query(
						`
						UPDATE organizations
						SET charify_credit = :updated_amt
						WHERE id = :org_id`,
						{
							type: db.Sequelize.QueryTypes.UPDATE,
							replacements: {
								org_id: org.id,
								updated_amt
							}
						}
					);
				} else finalAmountToOrg = selectedOrgAmount - applicationAndStripeFee;

				// now scale to match stripe standards
				let t = await stripe.transfers.create({
					amount: finalAmountToOrg * 100,
					currency: 'usd',
					source_transaction: charge.id,
					destination: currOrg[0].stripe_account_id
				});

				return t;
			});

			// to show the transaction fees in email to giver
			charge.transaction_fees = Math.round((amount * 0.029 + 0.3) * 1e2) / 1e2;

			resolve(charge);
		} catch (error) {
			reject(error);
		}
	});
};

// Delete grant's stripe plan under subscription
// exports.deleteGrant = async (req, res, next) => {
// 	const { grant_id } = req.body;

// 	try {
// 		const paymentPlans = await PaymentPlan.findAll({ where: { grant_id } });

// 		// check if there are plans for that grant
// 		if (!paymentPlans.length) {
// 			return res.status(400).json({
// 				message: 'Not a valid grant'
// 			});
// 		} else {
// 			const plan = paymentPlans[0];

// 			//delete the plan/grant under the subscription for the user
// 			await stripe.subscriptionItems.del(plan.sub_item_id);
// 			//delete the plan from the main product 'Grants'
// 			await stripe.plans.del(plan.plan_id);
// 		}

// 		next();
// 	} catch (error) {
// 		next(error);
// 	}
// };

// allows the org to see their stripe account with their balance and payout to their bank
exports.getExpressUILink = async (req, res, next) => {
	// get connected stripe account id from db
	// createLoginLink with stripe function
	// return to frontend
	const org_id = req.user.id;

	try {
		const orgs = await db.sequelize.query(
			`SELECT stripe_account_id 
			FROM organizations 
			WHERE id = :org_id
			LIMIT 1`,
			{ replacements: { org_id }, type: db.sequelize.QueryTypes.SELECT }
		);

		const stripeAccessRes = await stripe.accounts.createLoginLink(
			orgs[0].stripe_account_id
		);

		return res.status(200).json({ url: stripeAccessRes.url });
	} catch (error) {
		next(error);
	}
};

// verify the charity after they filled out basic info for express ui
exports.activateStripeAccount = async (req, res, next) => {
	const { code, state } = req.query;
	const org_id = state;

	try {
		var dataString = `client_secret=${
			process.env.STRIPE_KEY
		}&code=${code}&grant_type=authorization_code`;

		var options = {
			uri: 'https://connect.stripe.com/oauth/token',
			method: 'POST',
			body: {
				client_secret: process.env.STRIPE_KEY,
				code,
				grant_type: 'authorization_code'
			},
			json: true
		};

		// store for current user, get user_id from the state param maybe?
		const stripeAccRes = await requestPromise(options);
		const { stripe_user_id } = stripeAccRes;

		const updateRes = await db.sequelize.query(
			'UPDATE organizations SET stripe_account_id = :stripe_user_id WHERE id = :org_id',
			{ replacements: { stripe_user_id, org_id } }
		);

		let redirectUrl = process.env.STRIPE_CONNECT_ACTIVATE_REDIRECT_LINK;
		return res.status(302).redirect(redirectUrl);
	} catch (error) {
		next(error);
	}
};
