'use strict';

// DOESNT WORK AS NEED TO HASH PASSWORD TO DB
module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('donors', [
			{
				first_name: 'Arjun',
				email: 'patel.arjun50@gmail.com',
				password: 'test',
				last_name: 'Patel',
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('donors', {
			email: 'patel.arjun50@gmail.com'
		});
	}
};
