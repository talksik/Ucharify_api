'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('causes', [
			{
				name: 'Animal Care',
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: 'Water',
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('causes', [{ name: 'Water' }, { name: 'Animal Care' }]);
	}
};
