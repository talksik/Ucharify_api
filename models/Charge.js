'use strict';
const PaymentStatus = require('./PaymentStatus');

module.exports = (sequelize, DataTypes) => {
	const Charge = sequelize.define(
		'Charge',
		{
			id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
			description: DataTypes.STRING,
			amount: DataTypes.INTEGER,

			payment_status: {
				type: DataTypes.STRING,
				allowNull: false,
				references: {
					model: PaymentStatus(sequelize, DataTypes),
					key: 'name'
				}
			}
		},
		{
			freezeTableName: true,

			// define the table's name
			tableName: 'charges'
		}
	);

	return Charge;
};
