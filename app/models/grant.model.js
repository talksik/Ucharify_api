module.exports = (sequelize, DataTypes) => {
	const Grant = sequelize.define('grants', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		monthly: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		},
		num_causes: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		num_regions: {
			type: DataTypes.INTEGER,
			allowNull: false
		}
	});
	return Grant;
};
