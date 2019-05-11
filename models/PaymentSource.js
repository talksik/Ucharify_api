'use strict';
module.exports = (sequelize, DataTypes) => {
	const PaymentSource = sequelize.define(
		'PaymentSource',
		{
			id: {
				allowNull: false,
				primaryKey: true,
				type: DataTypes.UUID
			},
			token: {
				allowNull: false,
				type: DataTypes.STRING
			},
			provider: {
				allowNull: false,
				type: DataTypes.STRING
			},
			donor_id: {
				type: DataTypes.UUID,
				allowNull: false,
				references: {
					model: 'donors',
					key: 'id'
				}
			}
		},
		{
			freezeTableName: true,

			// define the table's name
			tableName: 'payment_sources'
		}
	);
	PaymentSource.associate = function(models) {
		// associations can be defined here
	};
	return PaymentSource;
};
