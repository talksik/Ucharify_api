const db = require('../../config/db.config.js'),
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
				const QUERY = `SELECT count(*) from causes `;
				db.sequelize.query(QUERY, {
					replacements: { causes, regions, max_orgs },
					type: db.Sequelize.QueryTypes.SELECT
				});
				sequelize.query;
				// hash and store
				bcrypt.hash(password, null, null, function(error, hash) {
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
		})
		.catch(error => next(error));
};
