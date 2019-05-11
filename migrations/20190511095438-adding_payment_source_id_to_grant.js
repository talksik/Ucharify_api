'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
		return queryInterface
			.addColumn('grants', 'payment_source_id', Sequelize.UUID)
			.then(() =>
				queryInterface.addConstraint('grants', ['payment_source_id'], {
					type: 'foreign key',
					name: 'grants_paymentsources_fk',
					references: {
						//Required field
						table: 'payment_sources',
						field: 'id'
					},
					onDelete: 'cascade',
					onUpdate: 'cascade'
				})
			);
	},

	down: (queryInterface, Sequelize) => {
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
		return queryInterface.removeColumn('grants', 'payment_source_id');
	}
};
