const Donor = require('./Donor');

module.exports = (sequelize, DataTypes) => {
	const Grant = sequelize.define(
		'Grant',
		{
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
				type: DataTypes.DOUBLE,
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
			},

			donor_id: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: 'donors',
					key: 'id'
				}
			},

			payment_source_id: {
				type: DataTypes.UUID,
				references: {
					//Required field
					model: 'payment_sources',
					field: 'id'
				}
			}
		},
		{
			freezeTableName: true,

			// define the table's name
			tableName: 'grants'
		}
	);

	Grant.associate = models => {
		Grant.hasMany(models.Charge, { foreignKey: 'grant_id' });
	};

	return Grant;
};
