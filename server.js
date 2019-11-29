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

// const cors = require('cors');  // un-comment if calls will come from another domain on front-end
// app.use(cors()); // un-comment if calls will come from another domain on front-end

// cron module
const cron = require('node-cron');

// config to use env variables
const config = require('config');

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
  max: 250
});
app.use(limiter);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// sets public folder for static files
app.use(express.static(path.join(__dirname, 'public')));

// allows calls if server is behind a proxy
app.enable('trust proxy');

// set up database connection
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
if (!config.get('jwtPrivateKey')) {
  logger.error('FATAL ERROR: jwtPrivateKey is not defined.');
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
        (store.closingDate && store.closingDate >= Date.now())
      ) {
        await Store.findByIdAndUpdate(store._id, { mode: 'OPEN' });
      }

      if (store.mode === 'OPEN' && store.closingDate && store.closingDate <= Date.now()) {
        await Store.findByIdAndUpdate(store._id, { mode: 'CLOSED' });
      }
    });
  },
  { scheduled: true, timezone: 'Etc/UTC' }
);

// configures server port
const PORT = config.get('app.port') || 5001;

// configures server to listen to configured server port above
app.listen(PORT, () =>
  logger.info(`Team Builder (${config.get('env')}) now listening on port ${PORT}...`)
);

module.exports = app;
