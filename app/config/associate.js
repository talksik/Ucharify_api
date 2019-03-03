module.exports = models => {
	const {
		Donor,
		Grant,
		Cause,
		Region,
		Organization,
		Charge,
		PaymentPlan,
		OrgBank
	} = models;

	Donor.hasMany(Grant, { foreignKey: 'donor_id' });

	Grant.belongsToMany(Cause, {
		through: 'grants_causes',
		foreignKey: 'grant_id',
		otherKey: 'cause_id'
	});

	Grant.belongsToMany(Region, {
		through: 'grants_regions',
		foreignKey: 'grant_id',
		otherKey: 'region_id'
	});

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

	Organization.hasOne(OrgBank);
};
