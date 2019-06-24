//SERVER START-UP CODE
const config = require('config');
const morgan = require('morgan');
const express = require('express');
require('express-async-errors');
const app = express();
const helmet = require('helmet');
const cors = require('cors');
const error = require('./middleware/error');
const mongoose = require('mongoose');

// Set up express, security and cors
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(helmet());
app.use(cors());
app.enable('trust proxy');

// setup db_host variable
const DB_HOST = config.get('database.host');

const connectWithRetry = async () => {
  try {
    await mongoose.connect(DB_HOST, { useNewUrlParser: true, autoReconnect: true, useFindAndModify: false, useCreateIndex: true });
    console.log('Connected to MongoDB..');
  } catch (err) {
    logger.error(err.message, err);
    setTimeout(connectWithRetry, 5000);
  }
};
connectWithRetry();

//Morgan Logging
if (app.get('env') === 'development') {
  app.use(morgan('tiny'));
  console.log(`Morgan enabled...`);
}

// Check if jwtPrivateKey env variable is set
if (!config.get('jwtPrivateKey')) {
  logger.error('FATAL ERROR: jwtPrivateKey is not defined.');
  process.exit(1);
}

// Load API Routes
app.use('/api/members', require('./routes/members'));
app.use('/api/catalogs', require('./routes/catalogs'));
app.use('/api/auth', require('./routes/auth'));
app.use(error);

// configures server port
const SERVER_PORT = config.get('server.port') || 5001;

//Displays environment application is in
console.log('Application Name: ' + config.get('name'));

// configures server to listen to configured server port above
app.listen(SERVER_PORT, () => console.log(`Listening on port ${SERVER_PORT}...`));

module.exports = logger;
