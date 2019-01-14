const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth');

const donors = require('../controllers/donors.controller.js');

// Signup route
router.post('/', donors.create);

// Retrieve all Donors
router.get('/', checkAuth, donors.findAll);

// Retrieve a single Donor by Id
router.get('/:DonorId', donors.findById);

// Delete a Donor with Id
router.delete('/:DonorId', donors.delete);

// // Update a Donor with Id
// router.put('/api/donors/:DonorId', donors.update);

module.exports = router;
