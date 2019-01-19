const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const { Grant, Cause, Region, Organization } = db;

// FETCH all causes
exports.findAll = (req, res, next) => {
	Cause.findAll()
		.then(causes => {
			res.status(200).json({
				causes,
				number_items: causes.length
			});
		})
		.catch(error => next(error));
};
