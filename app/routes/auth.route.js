const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth');

const { auth } = require('../controllers');

// Check database for donor and get token with donor role
router.post('/donor/login', auth.donorLogin);

// Check database for org and get token with org role
router.post('/org/login', auth.orgLogin);

// Code and send email for reset password
router.get('/resetpassword', auth.resetPasswordEmail);

// Reset password for either donor or charity after verifying code
router.post('/resetpassword', auth.resetPassword);

module.exports = router;
