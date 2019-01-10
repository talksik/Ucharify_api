const db = require('../config/db.config.js'),
	bcrypt = require('bcrypt-nodejs'),
	jwt = require('jsonwebtoken'),
	checkAuth = require('../middleware/check-auth');

const Donors = db.donors;

// Find a Donor by email + login with JWT
exports.login = (req, res) => {
	Donors.findAll({
		where: {
			email: req.body.email
		}
	})
		.then(donors => {
			if (donors.length < 1) {
				return res.status(401).json({
					message: 'Auth failed'
				});
			}
			bcrypt.compare(
				req.body.password,
				donors[0].password,
				(error, result) => {
					if (error) {
						return res.status(401).json({
							message: 'Auth failed'
						});
					}
					if (result) {
						const token = jwt.sign(
							{
								email: donors[0].email,
								id: donors[0].id
							},
							process.env.JWT_KEY,
							{
								expiresIn: '1h'
							}
						);
						return res.status(200).json({
							message: 'Auth successful',
							donor: donors[0],
							token
						});
					}
					return res.status(401).json({
						message: 'Auth failed'
					});
				}
			);
		})
		.catch(error => {
			console.log(error);

			return res.status(500).json({
				error
			});
		});
};
