const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const { Grant, Cause, Region, Organization } = db;

const log10 = val => {
	return Math.log(val) / Math.log(10);
};

// GET suggested organizations based on chosen causes + regions
exports.findSuggested = (req, res, next) => {
	const { amount, causes, regions } = req.body;

	// formula for max amount of organizations to choose
	const max_orgs = Math.floor(1.5 * log10(amount));

	const QUERY =
		'SELECT * from organizations ' +
		'WHERE primary_cause IN (:causes) and primary_region IN (:regions) ' +
		'LIMIT :max_orgs';
	db.sequelize
		.query(QUERY, {
			replacements: { causes, regions, max_orgs },
			type: db.Sequelize.QueryTypes.SELECT
		})
		.then(orgs => {
			res.status(200).json({
				orgs,
				num_items: orgs.length,
				max_orgs,
				distribution: amount / orgs.length
			});
		})
		.catch(error => next(error));
};

// GET min and optimal amounts for the chosen causes + regions
exports.findAmounts = (req, res, next) => {
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
