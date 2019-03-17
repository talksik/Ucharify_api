const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const { organization, cause, region } = require('../controllers');

// Charity signup route
router.post('/', organization.createOrganization);

// // Add cause
// router.post('/cause', checkAuth(roles.ORGANIZATION), cause.createCause);

// // Add region
// router.post('/region', checkAuth(roles.ORGANIZATION), region.createRegion);

module.exports = router;
