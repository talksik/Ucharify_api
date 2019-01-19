const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const { Grant, Cause, Region, Organization } = db;

// FETCH all regions
exports.findAll = (req, res, next) => {
	Region.findAll()
		.then(regions => {
			res.status(200).json({
				regions,
				number_items: regions.length
			});
		})
		.catch(error => next(error));
};
