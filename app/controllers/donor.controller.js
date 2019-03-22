const db = require('../../models'),
	bcrypt = require('bcrypt-nodejs'),
	errorMaker = require('../helpers/error.maker'),
	uuidv4 = require('uuid/v4');

const Donor = db.Donor;

// Create/post a Donor
exports.createDonor = (req, res, next) => {
	// see if user already in db
	Donor.findAll({
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
						Donor.create({
							id: uuidv4(),
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

// FETCH all Donor
exports.getAllDonors = (req, res, next) => {
	Donor.findAll().then(donors => {
		// Send all donors to Client
		res.status(200).json({
			donors,
			number_donors: donors.length
		});
	});
};

// Find a Donor by Id
exports.findDonorById = (req, res) => {
	Donor.findById(req.params.donor_id).then(donor => {
		res.send(donor);
	});
};

// Delete a Donor by Id
exports.deleteDonor = (req, res) => {
	const id = req.params.donor_id;
	Donor.destroy({
		where: { id: id }
	}).then(() => {
		res.status(200).send('deleted successfully a donor with id = ' + id);
	});
};

// GET the quick stats for the dashboard
exports.getDashboardData = async (req, res, next) => {
	console.log(req.user);
	const rows = await db.sequelize.query('Select * from donors', {
		type: db.sequelize.QueryTypes.SELECT
	});

	res.status(200).json({
		message: 'Successfully got the stats',
		rows
	});
};

// // Update a Donor
// exports.update = (req, res) => {
// 	const id = req.params.donor_id;
// 	Donor.update( { firstname: req.body.firstname, lastname: req.body.lastname, age: req.body.age },
// 					 { where: {id: req.params.donorId} }
// 				   ).then(() => {
// 					 res.status(200).send("updated successfully a donor with id = " + id);
// 				   });
// };
