const express = require('express'),
	router = express.Router(),
	roles = require('../helpers/roles');

const controllers = require('../controllers/organization');

// POST Signup route
router.post('/', controllers.organization.create);

module.exports = router;
