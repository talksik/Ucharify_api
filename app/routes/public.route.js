const express = require('express'),
	router = express.Router();

const controllers = require('../controllers/public');

// Retrieve all causes
router.get('/causes', controllers.cause.findAll);

// Retrieve all regions
router.get('/regions', controllers.region.findAll);

// Retrieve all organizations
router.get('/organizations', controllers.organization.findAll);

// Retrieve charities based on inputted search
// TODO: fix sql injection attack
router.get('/organizations/:search', controllers.organization.searchOrgs);

// Add user email to database from the landing page
router.post('/users/landing', controllers.user.addEmail);

module.exports = router;
