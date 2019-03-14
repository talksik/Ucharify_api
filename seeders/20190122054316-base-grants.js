'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		var sequelize = queryInterface.sequelize;
		const causes = [1, 2],
			regions = [1],
			organizations = [1, 2, 3];

		return Promise.all([
			sequelize.query(
				`INSERT INTO grants (id, name, amount, monthly, last_payment, num_causes, num_regions, created_at, updated_at, donor_id) 
                    VALUES (1, 'Max Impact in the South', 1000, 1, :last_payment, 2, 1, :created_at, :updated_at, (select id from donors where email='patel.arjun50@gmail.com'))`,
				{
					replacements: {
						last_payment: new Date(),
						created_at: new Date(),
						updated_at: new Date()
					},
					type: sequelize.QueryTypes.INSERT
				}
			),
			sequelize.query(
				`INSERT INTO grants_causes (grant_id, cause_id, created_at, updated_at) 
                    VALUES ((select id from grants where id=1), select id from causes where name='Animal Care', :created_at, :updated_at),
                    ((select id from grants where id=1), select id from causes where name='Water', :created_at, :updated_at)`,
				{
					replacements: {
						created_at: new Date(),
						updated_at: new Date()
					},
					type: sequelize.QueryTypes.INSERT
				}
			),
			sequelize.query(
				`INSERT INTO grants_regions (grant_id, cause_id, created_at, updated_at) 
                    VALUES ((select id from grants where id=1), select id from causes where name='Animal Care', :created_at, :updated_at),
                    ((select id from grants where id=1), select id from causes where name='Water', :created_at, :updated_at)`,
				{
					replacements: {
						created_at: new Date(),
						updated_at: new Date()
					},
					type: sequelize.QueryTypes.INSERT
				}
			),
			sequelize.query(
				`INSERT INTO grants_causes (grant_id, cause_id, created_at, updated_at) 
                    VALUES ((select id from grants where id=1), select id from causes where name='Animal Care', :created_at, :updated_at),
                    ((select id from grants where id=1), select id from causes where name='Water', :created_at, :updated_at)`,
				{
					replacements: {
						created_at: new Date(),
						updated_at: new Date()
					},
					type: sequelize.QueryTypes.INSERT
				}
			)
		]);
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.bulkDelete('grants', null, {});
	}
};
