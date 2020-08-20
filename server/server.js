const express = require('express');
const compression = require('compression');
const createError = require('http-errors');
require('express-async-errors'); // handle all async promise rejections and uncaught exception errors without trycatch blocks
const serveStatic = require('serve-static');

const app = express();

// security and sanitization modules
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
app.disable('x-powered-by');

// const cors = require('cors'); // un-comment if calls will come from another domain
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

// allows calls if server is behind a proxy
app.enable('trust proxy');

// Set up express & mongo sanitations and security
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());

// rate Limiting - 250 requests per 10 mins
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000,
});
app.use(limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(serveStatic(__dirname + '/server/dist'));

// set up database connection
const DB_USER = process.env.MONGO_INITDB_ROOT_USERNAME;
const DB_PASS = process.env.MONGO_INITDB_ROOT_PASSWORD;
let DB_DB = process.env.MONGO_INITDB_ROOT_DB;
let DB_HOST = '';

if (process.env.NODE_ENV === 'test') {
  DB_DB = 'teambuilder-test';
}

DB_HOST = `mongodb+srv://${DB_USER}:${DB_PASS}@teambuilder.a7dk1.mongodb.net/${DB_DB}?retryWrites=true&w=majority`;
require('./startup/db')(DB_HOST);

// handle all uncaught exceptions
process.on('uncaughtException', (ex) => {
  logger.error(ex.message, ex);
  process.exit(1);
});

// throw an exception to uncaught exception handler if unhandled promise rejection is encountered.
process.on('unhandledRejection', (ex) => {
  throw ex;
});

// establishes all endpoints allowed from front end
require('./startup/routes')(app);

// sends error to error handler if no endpoint is found
app.use((req, res, next) => {
  next(createError.NotFound());
});

// handles all errors
app.use((err, req, res, next) => {
  logger.error(err.status, err, err.message);
  res.status(err.status || 500).json([
    {
      error: {
        status: err.status,
        message: err.message,
      },
    },
  ]);
});

// setup cron job to open & close stores every hour based on openingDate & closingDate compared to current dateTime
cron.schedule(
  '0 * * * *',
  async () => {
    const stores = await Store.find();
    stores.forEach(async (store) => {
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
