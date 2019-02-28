const db = require('../../config/db.config.js'),
	errorMaker = require('../../helpers/error.maker');

const { Grant, Cause, Region, Organization } = db;

// Verify charity
exports.verifyOrg = async (req, res, next) => {
	const charity_id = req.params.charity_id;

	await db.sequelize.query("UPDATE organizations SET verified = 1 WHERE id = :charity_id", 
	{ replacements: {charity_id} });

	return res.status(200).json({ message: "Successfully verified charity" });
};
