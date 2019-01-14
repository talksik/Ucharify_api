module.exports = (sequelize, DataTypes) => {
	const Campaigns = sequelize.define('campaigns', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		// user_id: {
		// 	type: DataTypes.INTEGER,
		// 	references: {
		// 		// This is a reference to another model
		// 		model: Donors,
		// 		// This is the column name of the referenced model
		// 		key: 'id'
		// 	}
		// },
		name: DataTypes.STRING,
		amount: DataTypes.INTEGER
	});
	return Campaigns;
};
