'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('regions', [
      {
        name: 'Africa',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Eastern Asia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Southern Asia',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Central America',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'North America',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'South America',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Western Europe',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Middle East',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: 'Oceania',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('regions', [
      {
        name: 'Africa'
      },
      {
        name: 'Eastern Asia'
      },
      {
        name: 'Southern Asia'
      },
      {
        name: 'Central America'
      },
      {
        name: 'North America'
      },
      {
        name: 'South America'
      },
      {
        name: 'Western Europe'
      },
      {
        name: 'Middle East'
      },
      {
        name: 'Oceania'
      }
    ]);
  }
};
