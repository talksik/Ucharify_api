'use strict';
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.createTable('payment_sources', {
			id: {
				allowNull: false,
				primaryKey: true,
				type: Sequelize.UUID
			},
			token: {
				type: Sequelize.STRING
			},
			provider: {
				type: Sequelize.STRING
			},
			donor_id: {
				type: Sequelize.UUID,
				allowNull: false,
				references: {
					model: 'donors',
					key: 'id'
				}
			},
			createdAt: {
				allowNull: false,
				type: Sequelize.DATE
			},
			updatedAt: {
				allowNull: false,
				type: Sequelize.DATE
			}
		});
	},
	down: (queryInterface, Sequelize) => {
		return queryInterface.dropTable('PaymentSources');
	}
};
