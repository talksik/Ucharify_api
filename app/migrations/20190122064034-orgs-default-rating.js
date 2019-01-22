'use strict';

module.exports = {
	up: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('organizations', 'rating', {
			type: Sequelize.INTEGER,
			defaultValue: 5,
			allowNull: false
		});
	},

	down: (queryInterface, Sequelize) => {
		return queryInterface.changeColumn('organizations', 'rating', {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			allowNull: false
		});
	}
};
