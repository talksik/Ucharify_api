'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('charges', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			amount: {
				allowNull: false,
				type: Sequelize.INTEGER
			},
			description: {
				type: Sequelize.STRING
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: new Date()
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE,
				defaultValue: new Date()
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('charges');
	}
};
