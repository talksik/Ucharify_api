const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth');

const auth = require('../controllers/auth.controller.js');

// Check database for donor
router.post('/donor/login', auth.login);

module.exports = router;
