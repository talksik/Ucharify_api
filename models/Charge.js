'use strict';
module.exports = (sequelize, DataTypes) => {
	const Charge = sequelize.define('Charge', {
		id: { type: DataTypes.UUID, primaryKey: true, allowNull: false },
		description: DataTypes.STRING,
		amount: DataTypes.INTEGER
	});

	return Charge;
};
