'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('regions', [
			{
				name: 'North India',
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('regions', { name: 'North India' });
	}
};
