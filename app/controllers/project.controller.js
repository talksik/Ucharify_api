const db = require('../../models'),
	errorMaker = require('../helpers/error.maker'),
	textCleaner = require('../helpers/text_cleaner');

const { Project } = db;

exports.createProject = async (req, res, next) => {
	const organization_id = req.user.id;

	const { title, description } = req.body;

	const project = await Project.create({
		title,
		description,
		organization_id
	});

	return res.status(201).json({ project });
};
