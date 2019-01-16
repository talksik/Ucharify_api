module.exports = models => {
	const { Donors, Grants, Causes, Regions, Organizations } = models;

	Donors.hasMany(Grants, { foreignKey: 'donor_id' });

	Grants.belongsToMany(Causes, {
		through: 'grants_causes',
		foreignKey: 'grant_id',
		otherKey: 'cause_id'
	});

	Grants.belongsToMany(Regions, {
		through: 'grants_regions',
		foreignKey: 'grant_id',
		otherKey: 'region_id'
	});

	Grants.belongsToMany(Organizations, {
		through: 'grants_organizations',
		foreignKey: 'grant_id',
		otherKey: 'organization_id'
	});
};
