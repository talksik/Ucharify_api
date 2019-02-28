const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const controllers = require('../controllers/organization');

// Charity signup route
router.post('/', controllers.organization.create);

// Add cause
router.post('/cause', checkAuth(roles.ORGANIZATION), controllers.cause.create);

// Add region
router.post(
	'/region',
	checkAuth(roles.ORGANIZATION),
	controllers.region.create
);

module.exports = router;
