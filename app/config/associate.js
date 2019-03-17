module.exports = models => {
	const {
		Donor,
		Grant,
		Cause,
		Region,
		Organization,
		Charge,
		PaymentPlan,
		GrantsOrganizations,
		Project
	} = models;

	Donor.hasMany(Grant, { foreignKey: 'donor_id' });

	Grant.belongsToMany(Organization, {
		through: 'grants_organizations',
		foreignKey: 'grant_id',
		otherKey: 'organization_id'
	});

	Grant.hasMany(Charge, { foreignKey: 'grant_id' });

	Donor.hasMany(PaymentPlan, {
		foreignKey: 'subscription_id',
		sourceKey: 'subscription_id'
	});

	Grant.hasOne(PaymentPlan, {
		foreignKey: 'grant_id'
	});
};
