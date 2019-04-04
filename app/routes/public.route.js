const express = require('express'),
	router = express.Router();

const {
	sendgrid,
	cause,
	region,
	organization,
	user
} = require('../controllers');

// Retrieve all causes
router.get('/causes', cause.getAllCauses);

// Retrieve all regions
router.get('/regions', region.getAllRegions);

// Retrieve all organizations
router.get('/organizations', organization.getAllOrganizations);

// Retrieve organization by id
router.get('/organization/:charityId', organization.getOrganizationById);

// Retrieve charities based on inputted search
// TODO: fix sql injection attack
router.get('/organizations/:search', organization.searchOrganizations);

// Add user email to database from the landing page
router.post('/users/landing', user.addEmail);

// Test sending an email
router.post('/email/test', sendgrid.testEmail);

module.exports = router;
