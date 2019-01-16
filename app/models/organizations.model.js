module.exports = (sequelize, DataTypes) => {
	const Organizations = sequelize.define('organizations', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: { type: DataTypes.STRING, allowNull: false },
		short_description: DataTypes.STRING,
		primary_cause: { type: DataTypes.STRING, allowNull: false },
		primary_region: { type: DataTypes.STRING, allowNull: false }
	});
	return Organizations;
};
