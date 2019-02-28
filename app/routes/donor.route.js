const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const controllers = require('../controllers/donor');

// POST donor signup
router.post('/', controllers.donor.create);

// GET all Donors
router.get('/', checkAuth(roles.ADMIN), controllers.donor.findAll);

// GET grants with causes, regions, charities by donor_id
router.get('/grants/', checkAuth(roles.DONOR), controllers.grant.findByDonorId);

/** POST Create grants with following body:
 * - List of id's of selected causes, regions, charities
 * - Monthly: true or false
 * - donor_id
 * */
router.post(
	'/grants/',
	checkAuth(roles.DONOR),
	controllers.grant.create,
	controllers.stripe.grantCharge
);

// DELETE a grant of a donor
router.delete(
	'/grants/',
	checkAuth(roles.DONOR),
	controllers.stripe.deleteGrant,
	controllers.grant.delete
);

// POST to get suggested organizations to distribute to
// running "the algorithm"
router.post(
	'/organizations/',
	checkAuth(roles.DONOR),
	controllers.organization.findSuggested
);

// GET min and optimal amount to choose
router.get(
	'/organizations/amounts',
	checkAuth(roles.DONOR),
	controllers.organization.findAmounts
);

// // Retrieve a single Donor by Id
// router.get('/:donor_id', donor.findById);

// // Delete a Donor with Id
// router.delete('/:donor_id', donor.delete);

// // Update a Donor with Id
// router.put('/api/donors/:donor_id', donor.update);

module.exports = router;
