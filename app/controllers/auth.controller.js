const db = require('../config/db.config.js'),
	bcrypt = require('bcrypt-nodejs'),
	jwt = require('jsonwebtoken'),
	errorMaker = require('../helpers/error.maker');

const Donors = db.Donors;

// Find a Donor by email + login with JWT
exports.login = (req, res, next) => {
	Donors.findAll({
		where: {
			email: req.body.email
		}
	})
		.then(donors => {
			if (donors.length < 1) {
				return next(errorMaker(401, 'Invalid or nonexistent email'));
			}
			bcrypt.compare(req.body.password, donors[0].password, (error, result) => {
				if (error) {
					return next(error);
				}
				if (result) {
					const token = jwt.sign(
						{
							email: donors[0].email,
							id: donors[0].id
						},
						process.env.JWT_KEY
					);
					return res.status(200).json({
						message: 'Auth successful',
						donor: donors[0],
						token
					});
				}
				return next(errorMaker(401, 'Invalid user'));
			});
		})
		.catch(error => next(error));
};
