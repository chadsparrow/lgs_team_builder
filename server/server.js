const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const winston = require('winston');
require('winston-mongodb');
require('winston-daily-rotate-file');
const morgan = require('morgan');
const config = require('config');
const express = require('express');
require('express-async-errors');
const app = express();
require('./startup/routes')(app);

const DB_USER = config.get('database.user');
const DB_PASS = config.get('database.pass');
const DB_ADMINSOURCE = config.get('database.adminSource');
const DB_DB = config.get('database.db');
const DB_PORT = config.get('database.port') || 27018;
const DB_HOST = `mongodb://${DB_USER}:${DB_PASS}@mongo:${DB_PORT}/${DB_DB}?authSource${DB_ADMINSOURCE}`;
require('./startup/db')(DB_HOST);

// setup winston
winston.add(winston.transports.DailyRotateFile, { filename: './logs/teambuilder-%DATE%.log', maxFiles: '14d' });
winston.add(winston.transports.MongoDB, { db: DB_HOST });

// handle all uncaught expceptions
process.on('uncaughtException', ex => {
  winston.error(ex.message, ex);
  process.exit(1);
});

// throw an exception to uncaught exception handler if unhandle promise rejection is found.
process.on('unhandledRejection', ex => {
  throw ex;
});

//Morgan development API call Logging
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  winston.info(`Morgan enabled...`);
}

// Check if jwtPrivateKey env variable is set
if (!config.get('jwtPrivateKey')) {
  winston.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

//Displays environment application is in
winston.info('Application Name: ' + config.get('name'));

// configures server port
const APP_PORT = config.get('app.port') || 5001;
// configures server to listen to configured server port above
app.listen(APP_PORT, () => winston.info(`Listening on port ${APP_PORT}...`));
