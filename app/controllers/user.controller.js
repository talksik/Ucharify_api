const db = require('../../models'),
	errorMaker = require('../helpers/error.maker');

const { Grant, Cause, Region, Organization, User, sequelize } = db;

// POST an email into user general model from given email
exports.addEmail = async (req, res, next) => {
	try {
		const { email } = req.body;

		const users = await sequelize.query(
			`
			SELECT id 
			FROM users
			WHERE email = :email`,
			{
				type: sequelize.QueryTypes.SELECT,
				replacements: {
					email
				}
			}
		);

		if (users.length > 0) return next(errorMaker(409, 'Email already exists!'));

		const currDate = new Date();
		await sequelize.query(
			`
			INSERT INTO users
				(
					email,
					created_at,
					updated_at
				)
			VALUES
				(
					:email,
					:curr_date,
					:curr_date
				)`,
			{
				type: sequelize.QueryTypes.INSERT,
				replacements: {
					email,
					curr_date: currDate
				}
			}
		);

		return res.status(200).json({ message: 'Successfully signed up' });
	} catch (e) {
		return next(e);
	}
};
