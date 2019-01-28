const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const { Grant, Cause, Region, Organization } = db;

// ADD a region into the database
exports.create = (req, res, next) => {
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
