const db = require('../../models'),
	errorMaker = require('../helpers/error.maker'),
	textCleaner = require('../helpers/text_cleaner');

const { Grant, Cause, Region, Organization } = db;

// ADD a region into the database
exports.createRegion = (req, res, next) => {
	const { name } = req.body;

	Region.create({ name })
		.then(region => {
			res.status(200).json({
				message: 'Region created',
				region
			});
		})
		.catch(error => next(error));
};

// FETCH all regions
exports.getAllRegions = (req, res, next) => {
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
