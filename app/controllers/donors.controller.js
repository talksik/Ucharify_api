const db = require('../config/db.config.js'),
	bcrypt = require('bcrypt-nodejs');

const Donors = db.donors;

// Create/post a Donor
exports.create = (req, res) => {
	// see if user already in db
	Donors.findAll({
		where: {
			email: req.body.email
		}
	})
		.then(donors => {
			if (donors.length >= 1) {
				return res.status(409).json({
					message: 'Email exists'
				});
			} else {
				// hash and store
				bcrypt.hash(req.body.password, null, null, function(error, hash) {
					// Store hash in your password DB.
					if (error) {
						return res.status(500).json({
							error
						});
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
									message: 'User created',
									donor
								});
							})
							.catch(error => {
								return res.status(500).json({
									error
								});
							});
					}
				});
			}
		})
		.catch(error => {
			return res.status(500).json({
				error
			});
		});
};

// FETCH all Donors
exports.findAll = (req, res) => {
	Donors.findAll().then(donors => {
		// Send all donors to Client
		res.status(200).send(donors);
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
