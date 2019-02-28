const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const controllers = require('../controllers/admin');

// Manual verification of a charity
// TODO: Add checkAuth(roles.ADMIN) back into middleware
router.put(
	'/org/:charity_id',
	controllers.organization.verifyOrg
);

module.exports = router;
