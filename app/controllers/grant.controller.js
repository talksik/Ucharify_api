const db = require('../../models'),
	errorMaker = require('../helpers/error.maker');

const stripe = require('./stripe.controller');
const sendgrid = require('./sendgrid.controller');

const {
	Grant,
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

	actual_total = Math.round(amount * 100) / 100;

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

		const grantsOrgs = organizations.map(org => {
			return {
				grant_id: grant.id,
				organization_id: org.id,
				amount: org.amount
			};
		});

		// mapping between bundle and orgs
		await GrantOrganization.bulkCreate(grantsOrgs, {
			transaction
		});

		// one time charge
		const charge = await stripe.grantCharge({
			grant,
			stripeToken,
			stripeToken,
			organizations,
			monthly,
			amount,
			user
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

		// send email
		await sendgrid.paymentReceipt({
			organizations,
			total_amount: actual_total,
			receiver: user.email
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
					o.primary_region
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

exports.deleteGrant = (req, res, next) => {
	const { grant_id } = req.body;
	const user = req.user;

	Grant.destroy({ where: { id: grant_id, donor_id: user.id } })
		.then(result => {
			var message = 'Already Deleted';
			if (result) {
				message = 'Grant Deleted';
			}

			res.status(201).json({
				result,
				message
			});
		})
		.catch(error => next(error));
};
