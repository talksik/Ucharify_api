const db = require('../../models'),
	bcrypt = require('bcrypt-nodejs'),
	errorMaker = require('../helpers/error.maker'),
	uuidv4 = require('uuid/v4');

const { Grant, Cause, Region, Organization } = db;

// Verify charity
exports.verifyCharity = async (req, res, next) => {
	const charity_id = req.params.charity_id;

	await db.sequelize.query(
		'UPDATE organizations SET verified = 1 WHERE id = :charity_id',
		{ replacements: { charity_id } }
	);

	return res.status(200).json({ message: 'Successfully verified charity' });
};

const log10 = val => {
	return Math.log(val) / Math.log(10);
};

// POST to get suggested organizations based on chosen causes + regions
exports.findSuggestedCharities = (req, res, next) => {
	const { amount, causes, regions } = req.body;

	if (amount == 0 || causes.length == 0 || regions.length == 0) {
		return next(errorMaker(400, 'Invalid options for grant suggestions'));
	}

	// formula for max amount of organizations to choose
	const max_orgs = Math.floor(1.5 * log10(amount));

	const QUERY =
		'SELECT * from organizations ' +
		'WHERE primary_cause IN (:causes) or primary_region IN (:regions) ' +
		'LIMIT :max_orgs';
	db.sequelize
		.query(QUERY, {
			replacements: { causes, regions, max_orgs },
			type: db.Sequelize.QueryTypes.SELECT
		})
		.then(organizations => {
			res.status(200).json({
				organizations,
				num_items: organizations.length,
				max_orgs,
				distribution: amount / organizations.length
			});
		})
		.catch(error => next(error));
};

// GET min and optimal amounts for the chosen causes + regions
exports.findOptimalBundleAmounts = (req, res, next) => {
	const { num_causes, num_regions } = req.body;

	const feature_factor = parseInt(num_causes) + parseFloat(num_regions / 2);

	// calculate min amount for chosen causes and regions
	const min_amount = Math.ceil(feature_factor * 15);

	// calculate optimal for chosen causes and regions
	const optimal_amount = Math.ceil(Math.pow(5, feature_factor));

	res.status(200).json({
		min_amount,
		optimal_amount
	});
};

// POST create an organization
exports.createOrganization = async (req, res, next) => {
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

// FETCH all organizations
exports.getAllOrganizations = async (req, res, next) => {
	const QUERY = `
			select 
					o.*,
					p.id as project_id,
					p.title as project_title,
					p.description as project_description,
					p.isComplete
			from organizations as o
			left join (
					SELECT * from projects 
					where id in (
						select 
							max(id) 
						from projects 
						group by organization_id
						)
					)
			as p on p.organization_id = o.id
    `;
	const organizations = await db.sequelize.query(QUERY, {
		type: db.Sequelize.QueryTypes.SELECT
	});

	return res.status(200).json({
		organizations,
		number_items: organizations.length
	});
};

// FETCH depending on the given search
exports.searchOrganizations = (req, res, next) => {
	let { search } = req.params;
	search = '%' + search + '%';
	const limit = 10;

	const QUERY = `SELECT * from organizations 
								WHERE name LIKE :search or
											primary_cause LIKE :search or
											primary_region LIKE :search
								LIMIT :limit`;
	db.sequelize
		.query(QUERY, {
			replacements: { search, limit },
			type: db.Sequelize.QueryTypes.SELECT
		})
		.then(organizations => {
			res.status(200).json({
				organizations,
				number_items: organizations.length
			});
		})
		.catch(error => next(error));
};

exports.getOrganizationById = async (req, res, next) => {
	const { charityId } = req.params;

	const QUERY = `
			select 
					o.*,
					p.id as project_id,
					p.title as project_title,
					p.description as project_description,
					p.isComplete
			from organizations as o
			left join (
					SELECT * from projects 
					where id in (
						select 
							max(id) 
						from projects 
						group by organization_id
						)
					)
			as p on p.organization_id = o.id
			WHERE o.id = :charityId
    `;
	const org = await db.sequelize.query(QUERY, {
		replacements: { charityId },
		type: db.Sequelize.QueryTypes.SELECT
	});

	return res.status(200).json(org[0]);
};
