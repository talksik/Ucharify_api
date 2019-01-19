module.exports = models => {
	const { Donor, Grant, Cause, Region, Organization } = models;

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
};
