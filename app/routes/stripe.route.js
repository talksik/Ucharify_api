const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const controller = require('../controllers/stripe.controller');

// POST create one time or monthly charge for grant
router.post('/donor/grant', checkAuth(roles.DONOR), controller.grantCharge);

module.exports = router;
