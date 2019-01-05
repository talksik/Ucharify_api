const express = require('express'),
    router = express.Router();

const donors = require('../controllers/donors.controller.js');

// Create a new Donor
router.post('/', donors.create);

// Retrieve all Donor
router.get('/', donors.findAll);

// Retrieve a single Donor by Id
router.get('/:DonorId', donors.findById);

// Delete a Donor with Id
router.delete('/:DonorId', donors.delete);

// // Update a Donor with Id
// router.put('/api/donors/:DonorId', donors.update);

module.exports = router;