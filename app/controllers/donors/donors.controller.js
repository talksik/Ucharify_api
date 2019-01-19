const db = require('../../config/db.config.js'),
	bcrypt = require('bcrypt-nodejs'),
	errorMaker = require('../../helpers/error.maker');

const Donors = db.Donors;

// Create/post a Donor
exports.create = (req, res, next) => {
	// see if user already in db
	Donors.findAll({
		where: {
			email: req.body.email
		}
	})
		.then(donors => {
			if (donors.length >= 1) {
				return next(errorMaker(409, `Email Exists: ${req.body.email}`));
			} else {
				// hash and store
				bcrypt.hash(req.body.password, null, null, function(error, hash) {
					// Store hash in your password DB.
					if (error) {
						return next(error);
					} else {
						Donors.create({
							first_name: req.body.first_name,
							middle_name: req.body.middle_name,
							last_name: req.body.last_name,
							email: req.body.email,
							password: hash, //hashed password
							age: req.body.age,
							phone: req.body.phone,
							address: req.body.address,
							city: req.body.city,
							state: req.body.state,
							country: req.body.country
						})
							.then(donor => {
								// Send created donor to client
								return res.status(201).json({
									message: 'Donor created',
									donor
								});
							})
							.catch(error => next(error));
					}
				});
			}
		})
		.catch(error => next(error));
};

// FETCH all Donors
exports.findAll = (req, res, next) => {
	Donors.findAll().then(donors => {
		// Send all donors to Client
		res.status(200).json({
			donors,
			number_donors: donors.length
		});
	});
};

// Find a Donor by Id
exports.findById = (req, res) => {
	Donors.findById(req.params.donor_id).then(donor => {
		res.send(donor);
	});
};

// Delete a Donor by Id
exports.delete = (req, res) => {
	const id = req.params.donor_id;
	Donors.destroy({
		where: { id: id }
	}).then(() => {
		res.status(200).send('deleted successfully a donor with id = ' + id);
	});
};

// // Update a Donor
// exports.update = (req, res) => {
// 	const id = req.params.donor_id;
// 	Donors.update( { firstname: req.body.firstname, lastname: req.body.lastname, age: req.body.age },
// 					 { where: {id: req.params.donorId} }
// 				   ).then(() => {
// 					 res.status(200).send("updated successfully a donor with id = " + id);
// 				   });
// };
