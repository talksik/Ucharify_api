'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('paymentstatuses', [
			{
				name: 'pending',
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: 'paid',
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: 'failed',
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('paymentstatuses', [
			{
				name: 'pending'
			},
			{
				name: 'paid'
			},
			{
				name: 'failed'
			}
		]);
	}
};
