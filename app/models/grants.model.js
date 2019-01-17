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
			default: new Date()
		},
		monthly: {
			type: DataTypes.BOOLEAN,
			allowNull: false
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
	return Grants;
};
