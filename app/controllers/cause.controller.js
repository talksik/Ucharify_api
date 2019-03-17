const db = require('../../models'),
	errorMaker = require('../helpers/error.maker'),
	textCleaner = require('../helpers/text_cleaner');

const { Grant, Cause, Region, Organization } = db;

// ADD a cause into the database
exports.createCause = (req, res, next) => {
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

// FETCH all causes
exports.getAllCauses = (req, res, next) => {
	Cause.findAll()
		.then(causes => {
			causes = causes.map(cause => {
				cause.name = textCleaner.titleCase(cause.name);
				return cause;
			});

			res.status(200).json({
				causes,
				number_items: causes.length
			});
		})
		.catch(error => next(error));
};
