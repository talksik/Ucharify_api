'use strict';
module.exports = (sequelize, DataTypes) => {
	const PaymentPlan = sequelize.define('payment_plans', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		plan_id: {
			unique: true,
			type: DataTypes.UUID,
			allowNull: false
		},
		amount: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		sub_item_id: {
			type: DataTypes.UUID,
			unique: true
		}
	});

	return PaymentPlan;
};
