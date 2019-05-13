const db = require('../../models'),
	bcrypt = require('bcrypt-nodejs'),
	jwt = require('jsonwebtoken'),
	errorMaker = require('../helpers/error.maker'),
	roles = require('../helpers/roles'),
	uuidv4 = require('uuid/v4');

const sendgrid = require('./sendgrid.controller');

const { Donor, Organization, sequelize } = db;

// Find a Donor/Org by email + login with JWT
exports.donorLogin = (req, res, next) => {
	Donor.findAll({
		where: {
			email: req.body.email
		}
	})
		.then(users => {
			if (users.length < 1) {
				return next(errorMaker(401, 'Invalid or nonexistent email'));
			}
			bcrypt.compare(req.body.password, users[0].password, (error, result) => {
				if (error) {
					return next(error);
				}
				if (result) {
					const token = jwt.sign(
						{
							email: users[0].email,
							id: users[0].id,
							role: roles.DONOR
						},
						process.env.JWT_KEY
					);
					return res.status(200).json({
						message: 'Auth successful',
						user: users[0],
						token
					});
				}
				return next(errorMaker(401, 'Invalid donor'));
			});
		})
		.catch(error => next(error));
};

// Logging in Organization
exports.orgLogin = (req, res, next) => {
	Organization.findAll({
		where: {
			primary_contact_email: req.body.email
		}
	})
		.then(users => {
			if (users.length < 1) {
				return next(errorMaker(401, 'Invalid or nonexistent email'));
			}
			bcrypt.compare(req.body.password, users[0].password, (error, result) => {
				if (error) {
					return next(error);
				}
				if (result) {
					const token = jwt.sign(
						{
							email: users[0].email,
							id: users[0].id,
							role: roles.ORGANIZATION
						},
						process.env.JWT_KEY
					);
					return res.status(200).json({
						message: 'Auth successful',
						user: users[0],
						token
					});
				}
				return next(errorMaker(401, 'Invalid user'));
			});
		})
		.catch(error => next(error));
};

exports.resetPasswordEmail = async (req, res, next) => {
	try {
		const { email, usertype } = req.query;

		var user;
		if (usertype == 'donor') {
			user = await sequelize.query(
				`
			SELECT id FROM donors
			WHERE email = :email`,
				{
					type: sequelize.QueryTypes.SELECT,
					replacements: { email }
				}
			);
		} else {
			user = await sequelize.query(
				`
			SELECT id FROM organizations
			WHERE primary_contact_email = :email`,
				{
					type: sequelize.QueryTypes.SELECT,
					replacements: { email }
				}
			);
		}
		user = user[0];

		if (!user) return next(errorMaker(400, 'Not a valid user'));

		const CODE = uuidv4();
		const currDate = new Date();

		sequelize.query(
			`
			INSERT INTO password_reset
				(
					code,
					user_id,
					user_type,
					created_at,
					updated_at
				)
			VALUES
				(
					:code,
					:user_id,
					:user_type,
					:curr_date,
					:curr_date
				)`,
			{
				type: sequelize.QueryTypes.INSERT,
				replacements: {
					code: CODE,
					user_id: user.id,
					user_type: usertype,
					curr_date: currDate
				}
			}
		);

		await sendgrid.passwordResetEmail(email, CODE);

		return res
			.status(200)
			.json({ message: 'Successfuly sent password reset email!' });
	} catch (e) {
		next(e);
	}
};

exports.resetPassword = async (req, res, next) => {
	try {
		const { password, code } = req.query;

		var passwordResetRow = await sequelize.query(
			`
			SELECT * FROM password_reset
			WHERE code = :code`,
			{
				type: sequelize.QueryTypes.SELECT,
				replacements: { code }
			}
		);

		if (!passwordResetRow.length)
			return next(errorMaker(400, 'Forbidden to reset password'));

		passwordResetRow = passwordResetRow[0];

		//TODO check the timestamp of the code creation
		const createdDate = new Date(passwordResetRow.created_at);
		const currDate = new Date();
		const diffTime = Math.abs(currDate.getTime() - createdDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays > 3) return next(errorMaker(400, 'Code expired'));

		const hashedPass = bcrypt.hashSync(password);

		if (passwordResetRow.user_type == 'donor') {
			await sequelize.query(
				`
				UPDATE donors
				SET password = :password
				WHERE id = :user_id
				`,
				{
					type: sequelize.QueryTypes.UPDATE,
					replacements: {
						password: hashedPass,
						user_id: passwordResetRow.user_id
					}
				}
			);
		} else {
			await sequelize.query(
				`
				UPDATE organizations
				SET password = :password
				WHERE id = :user_id
				`,
				{
					type: sequelize.QueryTypes.UPDATE,
					replacements: {
						password: hashedPass,
						user_id: passwordResetRow.user_id
					}
				}
			);
		}

		return res.status(200).json({ message: 'Successfuly reset password!' });
	} catch (e) {
		next(e);
	}
};
