const db = require('../../../models'),
	errorMaker = require('../../helpers/error.maker'),
	textCleaner = require('../../helpers/text_cleaner');

const { Grant, Cause, Region, Organization } = db;

// FETCH all regions
exports.findAll = (req, res, next) => {
	Region.findAll()
		.then(regions => {
			regions = regions.map(region => {
				region.name = textCleaner.titleCase(region.name);
				return region;
			});

			res.status(200).json({
				regions,
				number_items: regions.length
			});
		})
		.catch(error => next(error));
};
