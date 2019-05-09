const db = require('../../models'),
	errorMaker = require('../helpers/error.maker');

const stripe = require('./stripe.controller');
const sendgrid = require('./sendgrid.controller');

const {
	Grant,
	Donor,
	Charge,
	Cause,
	Region,
	Organization,
	GrantOrganization,
	Project,
	sequelize
} = db;

// Create a grant for certain donor
exports.createGrant = async (req, res, next) => {
	const user = req.user;

	var { name, monthly, organizations, amount, stripeToken } = req.body;

	actual_total = amount;

	if (!stripeToken) {
		throw errorMaker(400, 'No stripe token given');
	}

	let transaction;

	try {
		// get transaction
		transaction = await sequelize.transaction();

		const grant = await Grant.create(
			{
				donor_id: user.id,
				name,
				amount: actual_total,
				monthly,
				num_causes: organizations.length,
				num_regions: organizations.length
			},
			{
				transaction
			}
		);

		await Promise.all(
			await organizations.map(async org => {
				let dbOrgs = await sequelize.query(
					`
				SELECT stripe_account_id,
								ein,
								charify_credit
				FROM organizations
				WHERE id = :org_id
				`,
					{
						type: sequelize.QueryTypes.SELECT,
						replacements: { org_id: org.id }
					}
				);

				org.stripe_account_id = dbOrgs[0].stripe_account_id;
				org.ein = dbOrgs[0].ein;
				org.charify_credit = dbOrgs[0].ein;
			})
		);

		// one time charge
		const charge = await stripe.grantCharge({
			grant,
			stripeToken,
			organizations,
			monthly,
			amount,
			user
		});

		const grantsOrgs = organizations.map(org => {
			return {
				grant_id: grant.id,
				organization_id: org.id,
				amount: org.finalAmountToOrg
			};
		});

		// mapping between bundle and orgs
		await GrantOrganization.bulkCreate(grantsOrgs, {
			transaction
		});

		await Charge.create(
			{
				id: charge.id,
				amount,
				description: 'One time payment for grant',
				grant_id: grant.id,
				payment_status: 'paid'
			},
			{ transaction }
		);

		const donors = await sequelize.query(
			`
			SELECT email, first_name, last_name
			FROM donors
			WHERE id = :donor_id
			`,
			{
				type: db.Sequelize.QueryTypes.SELECT,
				replacements: { donor_id: user.id }
			}
		);

		// send email
		await sendgrid.paymentReceipt({
			grant,
			organizations,
			total_amount: actual_total,
			transaction_fees: charge.transaction_fees,
			receiver: donors[0]
		});

		// commit
		await transaction.commit();

		return res.status(200).json({
			message: 'Successfully charged or subscribed',
			grant
		});
	} catch (error) {
		if (error) await transaction.rollback();
		next(error);
	}
};

// Find grants with causes, regions, and organizations by donor_id
exports.getGrantsByDonorId = async (req, res, next) => {
	const donor_id = req.user.id;

	try {
		const grants = await db.sequelize.query(
			`	
			Select * 
			from grants
			where donor_id = :donor_id
		`,
			{ type: db.sequelize.QueryTypes.SELECT, replacements: { donor_id } }
		);

		// adding in the organizations, causes, and regions for each grant into arrays
		await Promise.all(
			grants.map(async grant => {
				let grant_organizations = await db.sequelize.query(
					`
				Select 
					go.amount,
					o.id,
					o.name,
					o.primary_cause,
					o.primary_region,
					o.profile_pic_url
				from grants_organizations as go
				left join organizations as o on o.id = go.organization_id
				where grant_id = :grant_id
			`,
					{
						type: db.sequelize.QueryTypes.SELECT,
						replacements: { grant_id: grant.id }
					}
				);

				grant.organizations = grant_organizations;
				grant.monthly = grant.monthly == 1 ? true : false;
			})
		);

		return res.status(200).json({
			grants
		});
	} catch (error) {
		next(error);
	}
};

exports.cancelMonthlyGrant = async (req, res, next) => {
	const { grant_id } = req.params;

	try {
		await db.sequelize.query(
			`
			UPDATE grants
			SET monthly = 0
			WHERE Id = :grant_id`,
			{
				type: db.sequelize.QueryTypes.UPDATE,
				replacements: { grant_id }
			}
		);

		return res.status(200).json({
			message: 'Successfully cancelled grant monthly payments'
		});
	} catch (error) {
		next(error);
	}
};

exports.enableMonthlyGrant = async (req, res, next) => {
	const { grant_id } = req.params;

	try {
		await db.sequelize.query(
			`
			UPDATE grants
			SET monthly = 1
			WHERE Id = :grant_id`,
			{
				type: db.sequelize.QueryTypes.UPDATE,
				replacements: { grant_id }
			}
		);

		return res.status(200).json({
			message: 'Successfully enabled grant monthly payments'
		});
	} catch (error) {
		next(error);
	}
};
