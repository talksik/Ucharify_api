require('dotenv/config');

module.exports = {
	development: {
		username: 'root',
		password: 'water',
		database: 'base',
		host: 'localhost',
		dialect: 'mysql',

		// default options for all models
		define: {
			underscored: true, // true: use underscore for automatically added attributes like timestamps below
			timestamps: true // createdAt and updatedAt automatically added
		},

		// disable logging; default: console.log
		logging: false
	},
	test: {
		username: 'root',
		password: null,
		database: 'database_test',
		host: '127.0.0.1',
		dialect: 'mysql'
	},
	production: {
		username: 'fyro63k2989tyibh',
		password: 'ykjkyenyvxig208z',
		database: 'n0j9gxnf4ijr7g8t',
		host: 'am1shyeyqbxzy8gc.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
		dialect: 'mysql',

		// default options for all models
		define: {
			underscored: true, // true: use underscore for automatically added attributes like timestamps below
			timestamps: true // createdAt and updatedAt automatically added
		},

		// disable logging; default: console.log
		logging: false
	}
};
