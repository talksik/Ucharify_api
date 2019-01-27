const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const { Grant, Cause, Region, Organization } = db;

// PUT to change specific org's verify column to true
exports.verifyOrg = (req, res, next) => {
	const charity_id = req.params.charity_id;
};
