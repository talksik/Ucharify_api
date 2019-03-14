'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('organizations', [
			{
				name: 'Gopala Goshala',
				email: 'kcp1982@yahoo.com',
				password: hashedPass, //hashed password
				short_description:
					'We are focused on bringing lawful animal treatment in North India. Check out our many projects such as city water fountains for animals',
				primary_cause: 'Animal',
				primary_region,
				ein,
				primary_contact_first_name,
				primary_contact_last_name,
				phone,
				country,
				address,
				city,
				zip,
				estimate_assets,
				estimate_year_operating_cost
			},
			{
				name,
				email,
				password: hashedPass, //hashed password
				short_description,
				primary_cause,
				primary_region,
				ein,
				primary_contact_first_name,
				primary_contact_last_name,
				phone,
				country,
				address,
				city,
				zip,
				estimate_assets,
				estimate_year_operating_cost
			},
			{
				name,
				email,
				password: hashedPass, //hashed password
				short_description,
				primary_cause,
				primary_region,
				ein,
				primary_contact_first_name,
				primary_contact_last_name,
				phone,
				country,
				address,
				city,
				zip,
				estimate_assets,
				estimate_year_operating_cost
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
