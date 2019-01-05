const Sequelize = require('sequelize'),
    DonorsModel = require('../models/donors.model.js'),
    CampaignsModel = require('../models/campaigns.model.js');
    

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

const db = {};

//creating tables/models from imported function
const Donors = DonorsModel(sequelize, Sequelize);
const Campaigns = CampaignsModel(sequelize, Sequelize);
db.donors = Donors;
db.campaigns = Campaigns;

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;