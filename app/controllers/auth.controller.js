const db = require('../config/db.config.js'),
	bcrypt = require('bcrypt-nodejs'),
	jwt = require('jsonwebtoken'),
	errorMaker = require('../helpers/error.maker');

const { Donor, Organization } = db;

// Find a Donor/Org by email + login with JWT
exports.login = (type, role) => (req, res, next) => {
	const curr_types = {
		donor: Donor,
		org: Organization
	};

	curr_types[type]
		.findAll({
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
							role: role
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
