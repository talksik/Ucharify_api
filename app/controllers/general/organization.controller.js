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
