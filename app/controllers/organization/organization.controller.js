const db = require('../../../models'),
	bcrypt = require('bcrypt-nodejs'),
	errorMaker = require('../../helpers/error.maker'),
	uuidv4 = require('uuid/v4');

const { Grant, Cause, Region, Organization } = db;

// POST create an organization
exports.create = async (req, res, next) => {
	let {
		name,
		short_description,

		primary_contact_email,
		password,

		address,
		city,
		country,
		state,
		zip,

		primary_cause,
		primary_region,

		ein,
		estimate_asset_value,
		estimate_yearly_operating_cost,

		is_nonprofit,

		primary_contact_phone,
		primary_contact_first_name,
		primary_contact_last_name
	} = req.body;

	// primary_cause = primary_cause.trim().toLowerCase();
	// primary_region = primary_region.trim().toLowerCase();

	let transaction;

	try {
		transaction = await db.sequelize.transaction();

		const orgs = await Organization.findAll({
			where: { primary_contact_email }
		});

		if (orgs.length >= 1) {
			return next(errorMaker(409, `Email Exists: ${primary_contact_email}`));
		}

		const CAUSE_QUERY = `SELECT name FROM causes
												WHERE name = :primary_cause`;
		const causes = await db.sequelize.query(CAUSE_QUERY, {
			replacements: { primary_cause },
			type: db.Sequelize.QueryTypes.SELECT
		});

		const REGION_QUERY = `SELECT name FROM regions
												WHERE name = :primary_region`;
		const regions = await db.sequelize.query(REGION_QUERY, {
			replacements: { primary_region },
			type: db.Sequelize.QueryTypes.SELECT
		});

		// cause or region not found
		if (!causes.length || !regions.length) {
			throw errorMaker(400, `No valid cause or region`);
		}

		const saltRounds = await bcrypt.genSaltSync(10);
		// hash with salt rounds
		const hashedPass = await bcrypt.hashSync(password, saltRounds);

		// Store hash in DB
		const org = await Organization.create({
			id: uuidv4(),
			name,
			short_description,

			primary_contact_email,
			password: hashedPass,

			address,
			city,
			country,
			state,
			zip,

			primary_cause,
			primary_region,

			ein,
			estimate_asset_value,
			estimate_yearly_operating_cost,

			is_nonprofit,

			primary_contact_phone,
			primary_contact_first_name,
			primary_contact_last_name
		});

		await transaction.commit();

		return res.status(201).json({
			message: 'Organization created',
			org
		});
	} catch (error) {
		console.log(error);
		await transaction.rollback();
		next(error);
	}
};
