'use strict';
module.exports = (sequelize, DataTypes) => {
	const PasswordReset = sequelize.define(
		'password_reset',
		{
			code: {
				type: DataTypes.STRING,
				allowNull: false
			},
			user_id: {
				type: DataTypes.UUID,
				allowNull: false
			},
			user_type: {
				type: DataTypes.STRING,
				allowNull: false
			},
			created_at: {
				allowNull: false,
				type: DataTypes.DATE
			},
			updated_at: {
				allowNull: false,
				type: DataTypes.DATE
			}
		},
		{}
	);
	PasswordReset.associate = function(models) {
		// associations can be defined here
	};
	return PasswordReset;
};
