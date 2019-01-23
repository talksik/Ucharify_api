const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const { Grant, Cause, Region, Organization } = db;

// FETCH all organizations
exports.findAll = (req, res, next) => {
	Organization.findAll()
		.then(organizations => {
			res.status(200).json({
				organizations,
				number_items: organizations.length
			});
		})
		.catch(error => next(error));
};

// FETCH depending on the given search
exports.searchOrgs = (req, res, next) => {
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
