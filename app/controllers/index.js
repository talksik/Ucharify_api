module.exports = {
	donor: require('./donor.controller'),
	grant: require('./grant.controller'),
	organization: require('./organization.controller'),
	stripe: require('./stripe.controller'),
	sendgrid: require('./sendgrid.controller'),
	region: require('./region.controller'),
	cause: require('./cause.controller'),
	user: require('./user.controller'),
	auth: require('./auth.controller')
};
