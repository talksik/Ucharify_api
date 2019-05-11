const db = require('../../models'),
	errorMaker = require('../helpers/error.maker'),
	requestPromise = require('request-promise'),
	uuidv4 = require('uuid/v4');

const stripe = require('stripe')(process.env.STRIPE_KEY);

const { Donor, Organization, Charge, PaymentPlan, sequelize } = db;

// Subscribe user to plan or one time charge
exports.grantCharge = async ({
	grant,
	stripeToken,
	organizations,
	monthly,
	amount,
	user,
	transaction
}) => {
	return await new Promise(async (resolve, reject) => {
		try {
			const donors = await Donor.findAll({ where: { id: user.id } });

			const paymentSourceId = await addCustomerPaymentSource(
				donors[0],
				stripeToken,
				transaction
			);

			// set the grant's payment source id to the newly created one
			await sequelize.query(
				`
				UPDATE grants
				SET payment_source_id = :payment_source_id
				WHERE id = :grant_id`,
				{
					type: sequelize.QueryTypes.UPDATE,
					replacements: {
						payment_source_id: paymentSourceId,
						grant_id: grant.id
					},
					transaction
				}
			);

			const stripeAmount = amount * 100;

			// charge if yes or no monthly
			let charge = await stripe.charges.create({
				amount: stripeAmount,
				currency: 'usd',
				customer: donors[0].stripe_id,
				source: stripeToken,
				description: `UCharify Bundle ${grant.id}`,
				statement_descriptor: `UCharify Bundle ${grant.id}`,
				receipt_email: donors[0].email
			});

			// splitting the .30 cents per transaction to each org
			let indivThirtyCentFee =
				Math.round((0.3 / organizations.length) * 1e2) / 1e2;

			let updatedOrgs = await Promise.all(
				organizations.map(async org => {
					const selectedOrgAmount = org.amount;
					// this determines how much payment processing is covered
					const stripeFee =
						Math.round((selectedOrgAmount * 0.029 + indivThirtyCentFee) * 1e2) /
						1e2;
					// this determines how much Charify takes from each donation
					const applicationFee = 0;
					//const applicationFee = Math.round(selectedOrgAmount * 0.025 * 1e2) / 1e2;

					const applicationAndStripeFee = applicationFee + stripeFee;

					let finalAmountToOrg = 0;

					finalAmountToOrg = selectedOrgAmount - applicationAndStripeFee;

					// for record in grant org table
					org.finalAmountToOrg = finalAmountToOrg;
					// org.amountWithStripeFees = selectedOrgAmount - stripeFee;

					// now scale to match stripe standards
					let t = await stripe.transfers.create({
						amount: finalAmountToOrg * 100,
						currency: 'usd',
						source_transaction: charge.id,
						destination: org.stripe_account_id
					});

					return org;
				})
			);

			// to show the transaction fees in email to giver
			charge.transaction_fees = Math.round((amount * 0.029 + 0.3) * 1e2) / 1e2;
			// orgs with updated amounts after fees
			charge.updatedOrgs = updatedOrgs;

			resolve(charge);
		} catch (error) {
			reject(error);
		}
	});
};

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
			{
				type: sequelize.QueryTypes.UPDATE,
				replacements: { stripe_user_id, org_id }
			}
		);

		let redirectUrl = process.env.STRIPE_CONNECT_ACTIVATE_REDIRECT_LINK;
		return res.status(302).redirect(redirectUrl);
	} catch (error) {
		next(error);
	}
};

// Add a reusable source under a customer in stripe
const addCustomerPaymentSource = async (donor, source, transaction = null) => {
	return await new Promise(async (resolve, reject) => {
		try {
			if (!donor.stripe_id) {
				const stripeCustomer = await stripe.customers.create({
					email: donor.email,
					name: `${donor.first_name} ${donor.last_name}`,
					source
				});

				donor.stripe_id = stripeCustomer.id;

				await sequelize.query(
					`
					UPDATE donors
					SET stripe_id = :stripe_id
					WHERE id = :donor_id`,
					{
						type: sequelize.QueryTypes.UPDATE,
						replacements: { donor_id: donor.id, stripe_id: stripeCustomer.id },
						transaction
					}
				);
			} else {
				await stripe.customers.createSource(donor.stripe_id, {
					source
				});
			}

			const date = new Date();
			const paymentSourceId = uuidv4();
			await sequelize.query(
				`
				INSERT INTO payment_sources
					(id,
						token,
						provider,
						donor_id,
						createdAt,
						updatedAt
					)
				VALUES
					(:paymentSourceId,
						:source,
						:provider,
						:donor_id,
						:date,
						:date
					)`,
				{
					type: sequelize.QueryTypes.INSERT,
					replacements: {
						paymentSourceId,
						source,
						provider: 'stripe',
						donor_id: donor.id,
						date
					},
					transaction
				}
			);

			resolve(paymentSourceId);
		} catch (error) {
			reject(error);
		}
	});
};
