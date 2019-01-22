'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('causes', [
			{
				id: 1,
				name: 'Animal Care',
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				id: 2,
				name: 'Water',
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('causes');
	}
};
