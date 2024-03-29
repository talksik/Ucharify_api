'use strict';
const bcrypt = require('bcrypt-nodejs'),
	uuidv4 = require('uuid/v4');

// DOESNT WORK AS NEED TO HASH PASSWORD TO DB
module.exports = {
	up: async (queryInterface, Sequelize) => {
		var hash = bcrypt.hashSync('test', null);

		return queryInterface.bulkInsert('donors', [
			{
				id: uuidv4(),
				first_name: 'Arjun',
				last_name: 'Patel',
				email: 'patelarjun50@gmail.com',
				password: hash, //hashed password
				age: 20,
				phone: 9499230445,
				address: '14872 Waverly Lane',
				city: 'Irvine',
				state: 'CA',
				country: 'US',
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('donors', {
			email: 'patelarjun50@gmail.com'
		});
	}
};
