'use strict';
const bcrypt = require('bcrypt-nodejs'),
  uuidv4 = require('uuid/v4');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    var hashedPass = await bcrypt.hashSync('test', null);

    return queryInterface.bulkInsert('organizations', [
      {
        id: uuidv4(),
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
        primary_region: 'Southern Asia',

        ein: '63-6088665',
        estimate_asset_value: 200000,
        estimate_yearly_operating_cost: 40000,

        is_nonprofit: true,

        primary_contact_phone: '9493873423',
        primary_contact_first_name: 'Kamlesh',
        primary_contact_last_name: 'Patel',

        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'The Pollination Project',
        short_description:
          'Every day of the year, we give a grant to changemakers across the globe.',

        primary_contact_email: 'ajay@gmail.com',
        password: hashedPass,

        address: '2031 Carry Drive',
        city: 'San Francisco',
        country: 'USA',
        state: 'CA',
        zip: '92604',

        primary_cause: 'Human Services',
        primary_region: 'Africa',

        ein: '63-6088665',
        estimate_asset_value: 200000,
        estimate_yearly_operating_cost: 40000,

        is_nonprofit: true,

        primary_contact_phone: '6254581254',
        primary_contact_first_name: 'Ajay',
        primary_contact_last_name: 'Datta',

        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: uuidv4(),
        name: 'Cancer Global Perspective',
        short_description:
          'Your tax-deductible donation funds lifesaving research, treatment and care — and would mean so much to someone fighting cancer. Please donate today.',

        primary_contact_email: 'cancersupport@gmail.com',
        password: hashedPass,

        address: '82912 Larry Page Drive',
        city: 'Holmes',
        country: 'USA',
        state: 'AZ',
        zip: '92604',

        primary_cause: 'Animal',
        primary_region: 'Southern Asia',

        ein: '63-6088665',
        estimate_asset_value: 200000,
        estimate_yearly_operating_cost: 40000,

        is_nonprofit: true,

        primary_contact_phone: '6254581254',
        primary_contact_first_name: 'Leo',
        primary_contact_last_name: 'Rosen',

        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('organizations', [
      { primary_contact_email: 'kcp1982@yahoo.com' },
      { primary_contact_email: 'ajay@gmail.com' },
      { primary_contact_email: 'cancersupport@gmail.com' }
    ]);
  }
};
