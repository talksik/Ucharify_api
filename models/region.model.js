module.exports = (sequelize, DataTypes) => {
	const Region = sequelize.define('regions', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: { type: DataTypes.STRING, allowNull: false, unique: true }
	});
	return Region;
};
