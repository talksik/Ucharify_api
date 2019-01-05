const db = require('../config/db.config.js');
const Donors = db.donors;
 
// Post a Donor
exports.create = (req, res) => {	
	// Save to MySQL database
	Donors.create({  
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
        email: req.body.email,
        age: req.body.age,
        phone: req.body.phone,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country
	}).then(donor => {		
		// Send created donor to client
		res.send(donor);
	});
};
 
// FETCH all Donors
exports.findAll = (req, res) => {
	Donors.findAll().then(donors => {
	  // Send all donors to Client
	  res.send(donors);
	});
};
 
// Find a Donor by Id
exports.findById = (req, res) => {	
	Donors.findById(req.params.donor_id).then(donor => {
		res.send(donor);
	})
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