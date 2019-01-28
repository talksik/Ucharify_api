const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const controllers = require('../controllers/organization');

// POST Signup route
router.post('/', controllers.organization.create);

// POST add cause
router.post('/cause', checkAuth(roles.ORGANIZATION), controllers.cause.create);

// POST add region
router.post(
	'/region',
	checkAuth(roles.ORGANIZATION),
	controllers.region.create
);

module.exports = router;
