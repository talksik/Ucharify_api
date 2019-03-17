module.exports = (sequelize, DataTypes) => {
	const GrantsOrganizations = sequelize.define('Grants_Organizations', {
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
