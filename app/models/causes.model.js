module.exports = (sequelize, DataTypes) => {
	const Causes = sequelize.define('causes', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: { type: DataTypes.STRING, allowNull: false }
	});
	return Causes;
};
