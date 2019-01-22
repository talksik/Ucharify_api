'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('organizations', [
			{
				id: 1,
				name: 'Gopala Goshala',
				short_description: 'We are committed to animal shelter!',
				primary_cause: 'Animal Care',
				primary_region: 'North India',
				rating: 9.2,
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				id: 2,
				name: 'Water Organization India',
				short_description: 'We love water! So should you!',
				primary_cause: 'Water',
				primary_region: 'North India',
				rating: 8,
				created_at: new Date(),
				updated_at: new Date()
			},
			{
				id: 3,
				name: "Pete's Animals",
				short_description: 'Help us protect animals!',
				primary_cause: 'Animal Care',
				primary_region: 'North India',
				rating: 7.5,
				created_at: new Date(),
				updated_at: new Date()
			}
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('organizations', {
			[Sequelize.Op.or]: [
				{ name: 'Gopala Goshala' },
				{ name: 'Water Organization India' },
				{ name: "Pete's Animals" }
			]
		});
	}
};
