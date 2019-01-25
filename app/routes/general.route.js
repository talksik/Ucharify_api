const express = require('express'),
	router = express.Router();

const controllers = require('../controllers/general');

// Retrieve all causes
router.get('/causes', controllers.cause.findAll);

// Retrieve all regions
router.get('/regions', controllers.region.findAll);

// Retrieve all organizations
router.get('/organizations', controllers.organization.findAll);

// Retrieve based on inputted search
// limitted numer returned; empty input still returns orgs
router.get('/organizations/:search', controllers.organization.searchOrgs);

// Add email to database from the landing page
router.post('/users/landing', controllers.user.addEmail);

module.exports = router;
