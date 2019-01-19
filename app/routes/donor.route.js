const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth');

const donor = require('../controllers/donor/donor.controller.js');
const grant = require('../controllers/donor/grant.controller.js');

// Signup route
router.post('/', donor.create);

// Retrieve all Donors
router.get('/', checkAuth, donor.findAll);

// Retrieve grants with causes and regions and charities details by donor_id
router.get('/grants/:donor_id', checkAuth, grant.findByDonorId);

/** Create grants with following body:
 * - list of id's of selected causes and regions
 * - FINAL list of id's of selected organizations
 * - donor_id
 * */
router.post('/grants/:donor_id', checkAuth, grant.create);

// Delete a grant of a donor
router.delete('/grants/:grant_id', checkAuth, grant.delete);

// // Retrieve a single Donor by Id
// router.get('/:donor_id', donor.findById);

// // Delete a Donor with Id
// router.delete('/:donor_id', donor.delete);

// // Update a Donor with Id
// router.put('/api/donors/:donor_id', donor.update);

module.exports = router;
