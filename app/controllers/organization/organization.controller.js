const db = require('../../config/db.config.js'),
	bcrypt = require('bcrypt-nodejs'),
	errorMaker = require('../../helpers/error.maker');

const { Grant, Cause, Region, Organization } = db;

// POST create an organization
// Temporarily only use: name, email, password, short_description, primary_cause, primary_region
exports.create = (req, res, next) => {
	const {
		name,
		email,
		password,
		short_description,
		primary_cause,
		primary_region
	} = req.body;

	// see if organization already in db
	Organization.findAll({
		where: {
			email
		}
	})
		.then(orgs => {
			if (orgs.length >= 1) {
				return next(errorMaker(409, `Email Exists: ${email}`));
			} else {
				const QUERY = `SELECT c.name, r.name \
                          FROM causes AS c, regions AS r 
                          WHERE c.name = :primary_cause AND r.name = :primary_region`;
				return db.sequelize
					.query(QUERY, {
						replacements: { primary_cause, primary_region },
						type: db.Sequelize.QueryTypes.SELECT
					})
					.then(num => {
						if (num.length < 1) {
							// could not find the cause or region in the db
							return next(errorMaker(401, `Not a valid cause or region`));
						} else {
							// hash and store
							return bcrypt.hash(password, null, null, function(error, hash) {
								// Store hash in your password DB.
								if (error) {
									return next(error);
								} else {
									Organization.create({
										name,
										email,
										password: hash, //hashed password
										short_description,
										primary_cause,
										primary_region
									})
										.then(org => {
											// Send created org to client
											return res.status(201).json({
												message: 'Organization created',
												org
											});
										})
										.catch(error => next(error));
								}
							});
						}
					});
			}
		})
		.catch(error => next(error));
};
