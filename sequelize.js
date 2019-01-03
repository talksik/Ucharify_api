const Sequelize = require('sequelize'),
    DonorsModel = require('./models/Donors.js'),
    CampaignsModel = require('./models/Campaigns.js');


const host = 'am1shyeyqbxzy8gc.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    username = 'fyro63k2989tyibh',
    password = 'ykjkyenyvxig208z',
    port = '3306',
    database = 'n0j9gxnf4ijr7g8t';

const sequelize = new Sequelize(
    database, 
    username, 
    password, 
    {
        host: host,
        dialect: 'mysql',
        operatorsAliases: false,

        // research for pool/connections
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);

//creating tables from external files
const Donors = DonorsModel(sequelize, Sequelize);
const Campaigns = CampaignsModel(sequelize, Sequelize);

sequelize.sync({ force: true })
  .then(() => {
    console.log(`Database & tables created!`)
  })

module.exports = {
  Donors,
  Campaigns
}