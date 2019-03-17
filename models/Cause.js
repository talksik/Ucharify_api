module.exports = (sequelize, DataTypes) => {
	const Cause = sequelize.define('Cause', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: { type: DataTypes.STRING, allowNull: false, unique: true }
	});
	return Cause;
};
