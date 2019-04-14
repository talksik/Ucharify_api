module.exports = (sequelize, DataTypes) => {
	const Region = sequelize.define(
		'Region',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true
			},
			name: { type: DataTypes.STRING, allowNull: false, unique: true }
		},
		{
			freezeTableName: true,

			// define the table's name
			tableName: 'regions'
		}
	);
	return Region;
};
