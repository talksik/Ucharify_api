'use strict';
module.exports = (sequelize, DataTypes) => {
	const PasswordReset = sequelize.define(
		'password_reset',
		{
			code: {
				type: Sequelize.STRING,
				allowNull: false
			},
			user_id: {
				type: Sequelize.UUID,
				allowNull: false
			},
			user_type: {
				type: Sequelize.STRING,
				allowNull: false
			},
			created_at: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updated_at: {
				allowNull: false,
				type: Sequelize.DATE
			}
		},
		{}
	);
	PasswordReset.associate = function(models) {
		// associations can be defined here
	};
	return PasswordReset;
};
