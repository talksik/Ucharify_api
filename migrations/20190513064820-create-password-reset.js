'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('password_reset', {
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
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('password_reset');
	}
};
