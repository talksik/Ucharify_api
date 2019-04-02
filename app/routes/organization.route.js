const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const {
	organization,
	cause,
	region,
	stripe,
	project
} = require('../controllers');

// Charity signup route
router.post('/', organization.createOrganization);

// GET Activate org's stripe connected account
router.get('/stripe/connect', stripe.activateStripeAccount);

// GET stripe express ui account link
router.get(
	'/stripe/link',
	checkAuth(roles.ORGANIZATION),
	stripe.getExpressUILink
);

router.post('/project', checkAuth(roles.ORGANIZATION), project.createProject);

// // Add cause
// router.post('/cause', checkAuth(roles.ORGANIZATION), cause.createCause);

// // Add region
// router.post('/region', checkAuth(roles.ORGANIZATION), region.createRegion);

module.exports = router;
