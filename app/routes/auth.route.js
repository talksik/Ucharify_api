const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const auth = require('../controllers/auth.controller.js');

// Check database for donor and get token with donor role
router.post('/donor/login', auth.login('donor', roles.DONOR));

// Check database for org and get token with org role
router.post('/org/login', auth.login('org', roles.ORGANIZATION));

module.exports = router;
