const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const { organization, cause, region, stripe } = require('../controllers');

// Charity signup route
router.post('/', organization.createOrganization);

// GET Activate org with stripe
router.get('/stripe/connect', stripe.activateStripeAccount);

// GET express ui account link
router.get(
	'/stripe/link',
	checkAuth(roles.ORGANIZATION),
	stripe.getExpressUILink
);

// // Add cause
// router.post('/cause', checkAuth(roles.ORGANIZATION), cause.createCause);

// // Add region
// router.post('/region', checkAuth(roles.ORGANIZATION), region.createRegion);

module.exports = router;
