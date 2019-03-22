const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const { donor, grant, stripe, organization } = require('../controllers');

// POST donor signup
router.post('/', donor.createDonor);

// GET all Donors
router.get('/', checkAuth(roles.ADMIN), donor.getAllDonors);

// GET grants with causes, regions, charities by donor_id
router.get('/grants/', checkAuth(roles.DONOR), grant.findGrantsByDonorId);

/** POST Create grants with following body:
 * - List of id's of selected causes, regions, charities
 * - Monthly: true or false
 * - donor_id
 * */
router.post('/grants/', checkAuth(roles.DONOR), grant.createGrant);

// DELETE a grant of a donor
router.delete(
	'/grants/',
	checkAuth(roles.DONOR),
	stripe.deleteGrant,
	grant.deleteGrant
);

// POST to get suggested organizations to distribute to
// running "the algorithm"
router.post(
	'/organizations/',
	checkAuth(roles.DONOR),
	organization.findSuggestedCharities
);

// GET min and optimal amount to choose
router.get(
	'/organizations/amounts',
	checkAuth(roles.DONOR),
	organization.findOptimalBundleAmounts
);

router.get('/dashboard', checkAuth(roles.DONOR), donor.getDashboardData);

// // Retrieve a single Donor by Id
// router.get('/:donor_id', donor.findById);

// // Delete a Donor with Id
// router.delete('/:donor_id', donor.delete);

// // Update a Donor with Id
// router.put('/api/donors/:donor_id', donor.update);

module.exports = router;
