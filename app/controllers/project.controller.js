const db = require('../../models'),
	errorMaker = require('../helpers/error.maker'),
	textCleaner = require('../helpers/text_cleaner');

const { Project } = db;

exports.createProject = async (req, res, next) => {
	const { org_id } = req.user.id;

	var project = await db.sequelize.query(`
    SELECT * 
    FROM project
    WHERE organization_id = :org_id
    ORDER BY created_at `);
};
