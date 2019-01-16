module.exports = models => {
	const { Donors, Grants } = models;

	Donors.hasMany(Grants, { foreignKey: 'donor_id' });
};
