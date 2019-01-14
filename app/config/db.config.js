const Sequelize = require('sequelize'),
	DonorsModel = require('../models/donors.model.js'),
	GrantsModel = require('../models/grants.model.js');

const connection_uri = process.env.JAWSDB_MARIA_URL;

const sequelize = new Sequelize(connection_uri, {
	operatorsAliases: false,

	// research for pool/connections
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},

	// default options for all models
	define: {
		underscored: true, // true: use underscore for automatically added attributes like timestamps below
		freezeTableName: true, // true: table name/first parameter of define method will be table name
		timestamps: true // createdAt and updatedAt automatically added
	},

	// disable logging; default: console.log
	logging: false
});

const db = {};

//creating tables/models from imported functions
const Donors = DonorsModel(sequelize, Sequelize);
const Grants = GrantsModel(sequelize, Sequelize);
db.donors = Donors;
db.grants = Grants;

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
