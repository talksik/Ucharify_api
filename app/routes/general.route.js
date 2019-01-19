const express = require('express'),
	router = express.Router();

const controllers = require('../controllers/general');

// Retrieve all causes
router.get('/causes', controllers.cause.findAll);

// Retrieve all regions
router.get('/regions', controllers.region.findAll);

// Retrieve all organizations
router.get('/organizations', controllers.organization.findAll);

module.exports = router;
