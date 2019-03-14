'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.bulkInsert('organizations', [
			{
				name: 'Gopala Goshala',
				short_description:
					'We are focused on bringing lawful animal treatment in North India. Check out our many projects such as city water fountains for animals',

				primary_contact_email: 'kcp1982@yahoo.com',
				password: hashedPass,

				address: '14872 Waverly Lane',
				city: 'Irvine',
				country: 'USA',
				state: 'CA',
				zip: '92604',

				primary_cause: 'Animal',
				primary_region: 'North India',

				ein: '63-6088665',
				estimate_asset_value: 200000,
				estimate_yearly_operating_cost: 40000,

				isNonprofit: true,

				primary_contact_phone,
				primary_contact_first_name,
				primary_contact_last_name
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
