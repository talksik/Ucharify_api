require('dotenv/config');

module.exports = {
	local: {
		username: 'root',
		password: 'water',
		database: 'ucharify',
		host: 'localhost',
		dialect: 'mysql'
	},
	staging: {
		username: 'root',
		password: null,
		database: 'database_test',
		host: '127.0.0.1',
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
