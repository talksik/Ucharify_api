const Sequelize = require('sequelize'),
	DonorModel = require('../models/donor.model.js'),
	GrantModel = require('../models/grant.model.js'),
	CauseModel = require('../models/cause.model.js'),
	RegionModel = require('../models/region.model.js'),
	OrganizationModel = require('../models/organization.model.js'),
	UserModel = require('../models/user.model.js'),
	PaymentPlanModel = require('../models/paymentplan.model'),
	ChargeModel = require('../models/charge.model'),
	OrgBankModel = require('../models/orgBank.model'),
	GrantsOrganizationsModel = require('../models/grantsOrganizations.model'),
	associate = require('./associate');

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
const Donor = DonorModel(sequelize, Sequelize);
const Grant = GrantModel(sequelize, Sequelize);
const Cause = CauseModel(sequelize, Sequelize);
const Region = RegionModel(sequelize, Sequelize);
const Organization = OrganizationModel(sequelize, Sequelize);
const User = UserModel(sequelize, Sequelize);
const Charge = ChargeModel(sequelize, Sequelize);
const PaymentPlan = PaymentPlanModel(sequelize, Sequelize);
const OrgBank = OrgBankModel(sequelize, Sequelize);
const GrantsOrganizations = GrantsOrganizationsModel(sequelize, Sequelize);
db.Donor = Donor;
db.Grant = Grant;
db.Cause = Cause;
db.Region = Region;
db.Organization = Organization;
db.User = User;
db.Charge = Charge;
db.PaymentPlan = PaymentPlan;
db.OrgBank = OrgBank;
db.GrantsOrganizations = GrantsOrganizations;

// make associations with created models
associate(db);

db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
