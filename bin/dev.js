process.env.NODE_ENV =  process.env.NODE_ENV || 'development';

require('dotenv-flow').config({
    node_env: process.env.NODE_ENV
  });
require('../server');
