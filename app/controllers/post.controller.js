const db = require('../../models'),
	errorMaker = require('../helpers/error.maker'),
	textCleaner = require('../helpers/text_cleaner');

const { Post, sequelize } = db;

exports.createStatusUpdate = async (req, res, next) => {
	const { text } = req.body;

	try {
		const organization_id = req.user.id;
		console.log(organization_id);

		const post = await Post.create({ text, organization_id });

		return res.status(201).json(post);
	} catch (error) {
		next(error);
	}
};

// query params: {postId}
exports.addRibbon = async (req, res, next) => {
	const { update_id } = req.params;

	try {
		const posts = await sequelize.query(
			`
    SELECT num_ribbons
    FROM posts
    WHERE id = :update_id`,
			{ type: db.Sequelize.QueryTypes.SELECT, replacements: { update_id } }
		);

		const newNumRibbons = posts[0].num_ribbons + 1;

		const update = await sequelize.query(
			`
    UPDATE posts
    SET num_ribbons = :newNumRibbons
    WHERE id = :update_id`,
			{
				type: db.Sequelize.QueryTypes.UPDATE,
				replacements: { newNumRibbons, update_id }
			}
		);

		return res
			.status(200)
			.json({ message: 'Successfully added ribbon to post!' });
	} catch (error) {
		next(error);
	}
};
