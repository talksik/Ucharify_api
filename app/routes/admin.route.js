const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const controllers = require('../controllers/admin');

// PUT Manual verification of a charity
router.put(
	'/org/:charity_id',
	checkAuth(roles.ADMIN),
	controllers.organization.verifyOrg
);

module.exports = router;
