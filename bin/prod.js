process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.DROP_TABLES = true;

require('dotenv-flow').config({
	node_env: process.env.NODE_ENV
});
require('../server');
