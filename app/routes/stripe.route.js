const express = require('express'),
	router = express.Router(),
	checkAuth = require('../middleware/check-auth'),
	roles = require('../helpers/roles');

const controller = require('../controllers/donor/stripe.controller');

// POST create one time or monthly charge for grant
router.post('/donor/grant', checkAuth(roles.DONOR), controller.grantCharge);

// DELETE grant's plan under subscription
router.delete('/donor/grant', checkAuth(roles.DONOR), controller.deleteGrant);

module.exports = router;
