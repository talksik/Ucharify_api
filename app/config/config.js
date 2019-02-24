require('dotenv/config');

module.exports = {
	development: {
		username: 'root',
		password: 'water',
		database: 'ucharify',
		host: 'localhost',
		dialect: 'mysql'
	},
	test: {
		username: 'w8h1251do7cg4w7o',
		password: 'rpwk8opl1du3hheh',
		database: 'ppssehyr7u6n8h4o',
		host: 'thzz882efnak0xod.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
		dialect: 'mysql'
	},
	production: {
		username: process.env.DB_USERNAME,
		password: process.env.DB_PASSWORD,
		database: process.env.DB_DB,
		host: process.env.DB_HOST,
		dialect: process.env.DB_DIALECT
	}
};