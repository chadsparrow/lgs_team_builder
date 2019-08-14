const express = require('express');
require('express-async-errors');

const app = express();
const helmet = require('helmet');
// const cors = require('cors');
const config = require('config');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const logger = require('./middleware/logger');
const requestLogger = require('./middleware/requestLogger');

// Set up express, security
app.use(helmet());
// app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(express.static('public'));
app.use(requestLogger);

// app.use(cors());  //** Re-enable if needed for CORS Errors */
app.enable('trust proxy');

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
