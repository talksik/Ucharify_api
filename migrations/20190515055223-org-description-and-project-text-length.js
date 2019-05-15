'use strict';

module.exports = {
	up: async (queryInterface, Sequelize) => {
		/*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
		return Promise.all([
			queryInterface.changeColumn('organizations', 'short_description', {
				type: Sequelize.TEXT,
				allowNull: false
			}),
			queryInterface.changeColumn('projects', 'description', {
				type: Sequelize.TEXT,
				allowNull: false
			})
		]);
	},

	down: async (queryInterface, Sequelize) => {
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
		return Promise.all([
			queryInterface.changeColumn('organizations', 'short_description', {
				type: Sequelize.STRING,
				allowNull: false
			}),
			queryInterface.changeColumn('projects', 'description', {
				type: Sequelize.STRING,
				allowNull: false
			})
		]);
	}
};
