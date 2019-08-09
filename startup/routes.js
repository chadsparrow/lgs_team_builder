const helmet = require('helmet');
//const cors = require('cors'); //** Re-enable if needed for CORS Errors */
const error = require('../middleware/error');
const express = require('express');

module.exports = function(app) {
  // Set up express, security and cors
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
  app.use(express.static('public'));
  app.use(helmet());

  //app.use(cors());  //** Re-enable if needed for CORS Errors */
  app.enable('trust proxy');

  // Load API Routes
  app.use('/api/v1/members', require('../routes/members'));
  app.use('/api/v1/auth', require('../routes/auth'));
  app.use('/api/v1/notifications', require('../routes/notifications'));
  app.use('/api/v1/emails', require('../routes/emails'));
  app.use('/api/v1/teams', require('../routes/teams'));
  app.use('/api/v1/coupons', require('../routes/coupons'));
  app.use('/api/v1/catalogs', require('../routes/catalogs'));
  app.use('/api/v1/catalogitems', require('../routes/catalogitems'));
  app.use('/api/v1/stores', require('../routes/stores'));
  app.use('/api/v1/storeitems', require('../routes/storeitems'));
  app.use('/api/v1/orders', require('../routes/orders'));
  app.use('/api/v1/joinrequests', require('../routes/joinrequests'));
  app.use(error);
};
