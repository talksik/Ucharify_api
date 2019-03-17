const db = require('../../models'),
	bcrypt = require('bcrypt-nodejs'),
	jwt = require('jsonwebtoken'),
	errorMaker = require('../helpers/error.maker'),
	roles = require('../helpers/roles');

const { Donor, Organization } = db;

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
