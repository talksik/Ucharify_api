module.exports = (sequelize, DataTypes) => {
	const Grants = sequelize.define('grants', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		name: DataTypes.STRING,
		amount: DataTypes.INTEGER,
		last_payment: DataTypes.DATE,
		monthly: DataTypes.TINYINT(1),
		num_causes: DataTypes.INTEGER,
		num_regions: DataTypes.INTEGER
	});
	return Grants;
};
