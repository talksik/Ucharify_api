module.exports = models => {
	const {
		donor,
		Grant,
		Cause,
		Region,
		Organization,
		Charge,
		PaymentPlan,
		GrantsOrganizations,
		Project
	} = models;
	console.log(models);

	donor.hasMany(Grant, { foreignKey: 'donor_id' });

	Grant.belongsToMany(Organization, {
		through: 'Grant_Organization',
		foreignKey: 'grant_id',
		otherKey: 'organization_id'
	});

	Grant.hasMany(Charge, { foreignKey: 'grant_id' });
};
