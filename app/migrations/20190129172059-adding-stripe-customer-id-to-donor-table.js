'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.addColumn('donors', 'stripe_id', {
			type: Sequelize.UUID,
			defaultValue: null
		});
	},

	down: (queryInterface, Sequelize) => {
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
	}
};
