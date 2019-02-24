process.env.NODE_ENV =  process.env.NODE_ENV || 'test';

require('dotenv-flow').config({
    node_env: process.env.NODE_ENV
  });
require('../server');
