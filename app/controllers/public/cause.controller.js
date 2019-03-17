const db = require('../../../models'),
	errorMaker = require('../../helpers/error.maker'),
	textCleaner = require('../../helpers/text_cleaner');

const { Grant, Cause, Region, Organization } = db;

// FETCH all causes
exports.findAll = (req, res, next) => {
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
