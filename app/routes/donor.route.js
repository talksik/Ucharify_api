const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth');

const controllers = require('../controllers/donor');

// POST Signup route
router.post('/', controllers.donor.create);

// GET Retrieve all Donors
router.get('/', checkAuth, controllers.donor.findAll);

// GET Retrieve grants with causes and regions and charities details by donor_id
router.get('/grants/:donor_id', checkAuth, controllers.grant.findByDonorId);

/** POST Create grants with following body:
 * - list of id's of selected causes and regions
 * - FINAL list of id's of selected organizations
 * - donor_id
 * */
router.post('/grants/:donor_id', checkAuth, controllers.grant.create);

// DELECT a grant of a donor
router.delete('/grants/:grant_id', checkAuth, controllers.grant.delete);

// GET suggested organizations to distribute to
// running "the algorithm"
router.get(
	'/organizations/',
	checkAuth,
	controllers.organization.findSuggested
);

// GET min and optimal amount to choose
router.get(
	'/organizations/amounts',
	checkAuth,
	controllers.organization.findAmounts
);

// // Retrieve a single Donor by Id
// router.get('/:donor_id', donor.findById);

// // Delete a Donor with Id
// router.delete('/:donor_id', donor.delete);

// // Update a Donor with Id
// router.put('/api/donors/:donor_id', donor.update);

module.exports = router;
