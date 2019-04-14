'use strict';
module.exports = (sequelize, DataTypes) => {
	const User = sequelize.define(
		'User',
		{
			id: {
				type: DataTypes.INTEGER,
				primaryKey: true,
				autoIncrement: true,
				allowNull: false
			},
			first_name: DataTypes.STRING,
			last_name: DataTypes.STRING,
			email: {
				type: DataTypes.STRING,
				validate: {
					isEmail: true
				},
				allowNull: false
			}
		},
		{
			freezeTableName: true,

			// define the table's name
			tableName: 'users'
		}
	);
	return User;
};
