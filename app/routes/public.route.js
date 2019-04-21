const express = require('express'),
	router = express.Router();

const {
	sendgrid,
	cause,
	region,
	organization,
	user,
	post
} = require('../controllers');

// Retrieve all causes
router.get('/causes', cause.getAllCauses);

// Retrieve all regions
router.get('/regions', region.getAllRegions);

// Retrieve all organizations
router.get('/organizations', organization.getAllOrganizations);

// Retrieve organization by id
router.get('/organization/:charityId', organization.getOrganizationById);

// get all posts for an organization
router.get(
	'/organizations/statusupdates/:organization_id',
	post.getStatusUpdatesByOrg
);

// Retrieve charities based on inputted search
// TODO: fix sql injection attack
router.get('/organizations/:search', organization.searchOrganizations);

// Add user email to database from the landing page
router.post('/landing/email', user.addEmail);

// Test sending an email
router.post('/email/test', sendgrid.testEmail);

module.exports = router;
