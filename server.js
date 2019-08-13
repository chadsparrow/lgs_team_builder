const express = require('express');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const config = require('config');
const logger = require('./middleware/logger');
require('express-async-errors');

const app = express();

const DB_USER = config.get('database.user');
const DB_PASS = config.get('database.pass');
const DB_ADMINSOURCE = config.get('database.adminSource');
const DB_DB = config.get('database.db');
const DB_PORT = config.get('database.port') || 27018;
let DB_URI = '';
let DB_HOST = '';

if (config.get('env') === 'test') {
  DB_URI = 'localhost';
} else {
  DB_URI = 'mongo';
}

DB_HOST = `mongodb://${DB_USER}:${DB_PASS}@${DB_URI}:${DB_PORT}/${DB_DB}?authSource=${DB_ADMINSOURCE}`;
require('./startup/db')(DB_HOST);

// handle all uncaught expceptions
process.on('uncaughtException', ex => {
  logger.error(ex.message, ex);
  process.exit(1);
});

// throw an exception to uncaught exception handler if unhandle promise rejection is found.
process.on('unhandledRejection', ex => {
  throw ex;
});

// Check if jwtPrivateKey env variable is set
if (!config.get('jwtPrivateKey')) {
  logger.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

require('./startup/routes')(app);

// configures server port
const PORT = config.get('app.port') || 5001;

// configures server to listen to configured server port above
app.listen(PORT, () =>
  logger.info(`Team Builder (${process.env.NODE_ENV}) now listening on port ${PORT}...`)
);

module.exports = app;
