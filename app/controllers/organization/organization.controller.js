const db = require('../../config/db.config.js'),
	bcrypt = require('bcrypt-nodejs'),
	errorMaker = require('../../helpers/error.maker');

const { Grant, Cause, Region, Organization } = db;

// POST create an organization
exports.create = async (req, res, next) => {
	let {
		name,
		email,
		password,
		short_description,
		primary_cause,
		primary_region,
		ein,
		primary_contact_first_name,
		primary_contact_last_name,
		phone,
		country,
		address,
		city,
		zip,
		estimate_assets,
		estimate_year_operating_cost
	} = req.body;

	primary_cause = primary_cause.trim().toLowerCase();
	primary_region = primary_region.trim().toLowerCase();

	let transaction;

	try {
		transaction = await db.sequelize.transaction();

		const orgs = await Organization.findAll({ where: { email } });

		if (orgs.length >= 1) {
			return next(errorMaker(409, `Email Exists: ${email}`));
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
		if (!causes.length) {
			await Cause.create({ name: primary_cause }, { transaction });
		}
		if (!regions.length) {
			await Region.create({ name: primary_region }, { transaction });
		}

		const saltRounds = await bcrypt.genSaltSync(10);
		// hash with salt rounds 
		const hashedPass = await bcrypt.hashSync(password, saltRounds);

		// Store hash in DB
		const org = await Organization.create({
			name,
			email,
			password: hashedPass, //hashed password
			short_description,
			primary_cause,
			primary_region,
			ein,
			primary_contact_first_name,
			primary_contact_last_name,
			phone,
			country,
			address,
			city,
			zip,
			estimate_assets,
			estimate_year_operating_cost
		});

		await transaction.commit();

		return res.status(201).json({
			message: 'Organization created',
			org
		});
	} catch (error) {
		await transaction.rollback();
		next(error);
	}
};
