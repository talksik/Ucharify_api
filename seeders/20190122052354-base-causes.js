'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('causes', [
			{
				name: 'Animal',
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: 'Environment',
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: 'Health',
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: 'Human Services',
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: 'Education',
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: 'Arts and Culture',
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				name: 'Religion',
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('causes', [
			{
				name: 'Animal'
			},
			{
				name: 'Environment'
			},
			{
				name: 'Health'
			},
			{
				name: 'Human Services'
			},
			{
				name: 'Education'
			},
			{
				name: 'Arts and Culture'
			},
			{
				name: 'Religion'
			}
		]);
	}
};
