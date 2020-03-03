require('dotenv');
const path = require('path');
const express = require('express');
require('express-async-errors'); // handle all async promise rejections and uncaught exception errors without trycatch blocks

const app = express();

// security and sanitization modules
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// const cors = require('cors');  // un-comment if calls will come from another domain
// app.use(cors()); // un-comment if calls will come from another domain

// cron module
const cron = require('node-cron');

// setup input validation and sanitization
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const { Store } = require('./models/Store');

// setup logger/request logger during development
const logger = require('./middleware/logger');
const requestLogger = require('./middleware/requestLogger');

app.use(requestLogger);

// Set up express & mongo sanitations and security
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// rate Limiting - 250 requests per 10 mins
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// sets public folder for static files
app.use(express.static(path.join(__dirname, 'static')));

// allows calls if server is behind a proxy
app.enable('trust proxy');

// set up database connection
const DB_USER = process.env.MONGO_INITDB_ROOT_USERNAME;
const DB_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD;
const DB_ADMINSOURCE = process.env.MONGO_INITDB_ROOT_ADMINSOURCE;
let DB_DB = process.env.MONGO_INITDB_ROOT_DB;
const DB_PORT = process.env.MONGO_INITDB_ROOT_PORT || 27018;
let DB_HOST = '';

if (process.env.NODE_ENV === 'test') {
  DB_DB = 'teambuilder-test';
}

DB_HOST = `mongodb://${DB_USER}:${DB_PASS}@mongo:${DB_PORT}/${DB_DB}?authSource=${DB_ADMINSOURCE}?retryWrites=true&w=majority`;
require('./startup/db')(DB_HOST);

// handle all uncaught exceptions
process.on('uncaughtException', ex => {
  logger.error(ex.message, ex);
  process.exit(1);
});

// throw an exception to uncaught exception handler if unhandled promise rejection is encountered.
process.on('unhandledRejection', ex => {
  throw ex;
});

// Check if jwtPrivateKey env variable is set
if (!process.env.JWT_PRIVATE_KEY) {
  logger.error('FATAL ERROR: JWT_PRIVATE_KEY ENV VARIABLE is not defined.');
  process.exit(1);
}

// establishes all endpoints allowed from front end
require('./startup/routes')(app);

// setup cron job to open & close stores every hour based on openingDate & closingDate compared to current dateTime
cron.schedule(
  '0 * * * *',
  async () => {
    const stores = await Store.find();
    stores.forEach(async store => {
      if (
        store.mode === 'SURVEY' &&
        store.openingDate &&
        store.openingDate <= Date.now() &&
        store.closingDate &&
        store.closingDate >= Date.now()
      ) {
        await Store.findByIdAndUpdate(store._id, { mode: 'OPEN' });
      }

      if (
        store.mode === 'OPEN' &&
        store.closingDate &&
        store.closingDate <= Date.now()
      ) {
        await Store.findByIdAndUpdate(store._id, { mode: 'CLOSED' });
      }
    });
  },
  { scheduled: true, timezone: 'Etc/UTC' }
);

module.exports = app;
