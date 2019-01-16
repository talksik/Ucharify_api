module.exports = (sequelize, DataTypes) => {
	const Grants = sequelize.define('grants', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		last_payment: {
			type: DataTypes.DATE,
			allowNull: false,
			default: new Date()
		},
		monthly: DataTypes.BOOLEAN,
		num_causes: DataTypes.INTEGER,
		num_regions: DataTypes.INTEGER
	});
	return Grants;
};
