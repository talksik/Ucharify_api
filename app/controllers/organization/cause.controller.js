const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const { Grant, Cause, Region, Organization } = db;

// ADD a cause into the database
exports.create = (req, res, next) => {
	const { name } = req.body;

	Cause.create({ name })
		.then(cause => {
			res.status(200).json({
				message: 'Cause created',
				cause
			});
		})
		.catch(error => next(error));
};
