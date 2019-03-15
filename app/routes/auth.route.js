const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth');

const auth = require('../controllers/auth.controller.js');

// Check database for donor and get token with donor role
router.post('/donor/login', auth.donorLogin);

// Check database for org and get token with org role
router.post('/org/login', auth.orgLogin);

module.exports = router;
