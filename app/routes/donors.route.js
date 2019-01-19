const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth');

const donors = require('../controllers/donors/donors.controller.js');
const grants = require('../controllers/donors/grants.controller.js');

// Signup route
router.post('/', donors.create);

// Retrieve all Donors
router.get('/', checkAuth, donors.findAll);

// Retrieve grants with causes and regions and charities details by donor_id
router.get('/grants/:donor_id', checkAuth, grants.findByDonorId);

/** Create grants with following body:
 * - list of id's of selected causes and regions
 * - FINAL list of id's of selected organizations
 * - donor_id
 * */
router.post('/grants/:donor_id', checkAuth, grants.create);

// Delete a grant of a donor
router.delete('/grants/:grant_id', checkAuth, grants.delete);

// // Retrieve a single Donor by Id
// router.get('/:donor_id', donors.findById);

// // Delete a Donor with Id
// router.delete('/:donor_id', donors.delete);

// // Update a Donor with Id
// router.put('/api/donors/:donor_id', donors.update);

module.exports = router;
