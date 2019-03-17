const db = require('../../models'),
	errorMaker = require('../helpers/error.maker');

const { Grant, Cause, Region, Organization, User } = db;

// POST an email into user general model from given email
exports.addEmail = (req, res, next) => {
	User.findAll({
		where: {
			email: req.body.email
		}
	})
		.then(users => {
			if (users.length >= 1) {
				return next(errorMaker(409, `Email Exists: ${req.body.email}`));
			} else {
				User.create({
					email: req.body.email
				})
					.then(donor => {
						// Send created user to client
						return res.status(201).json({
							message: 'User created',
							donor
						});
					})
					.catch(error => next(error));
			}
		})
		.catch(error => next(error));
};
