module.exports = (sequelize, DataTypes) => {
	const GrantsOrganizations = sequelize.define('grants_organizations', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	});
	return GrantsOrganizations;
};
