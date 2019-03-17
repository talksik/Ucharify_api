const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const { organization } = require('../controllers');

// Manual verification of a charity
// TODO: Add checkAuth(roles.ADMIN) back into middleware
router.put('/org/:charity_id', organization.verifyCharity);

module.exports = router;
