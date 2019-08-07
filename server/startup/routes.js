const helmet = require('helmet');
//const cors = require('cors');
const error = require('../middleware/error');
const express = require('express');

module.exports = function(app) {
  // Set up express, security and cors
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
  app.use(express.static('public'));
  app.use(helmet());

  //app.use(cors());
  app.enable('trust proxy');

  // Load API Routes
  app.use('/api/members', require('../routes/members'));
  app.use('/api/auth', require('../routes/auth'));
  app.use('/api/notifications', require('../routes/notifications'));
  app.use('/api/emails', require('../routes/emails'));
  app.use('/api/teams', require('../routes/teams'));
  app.use('/api/coupons', require('../routes/coupons'));
  app.use('/api/catalogs', require('../routes/catalogs'));
  app.use('/api/catalogitems', require('../routes/catalogitems'));
  app.use('/api/stores', require('../routes/stores'));
  app.use('/api/storeitems', require('../routes/storeitems'));
  app.use('/api/joinrequests', require('../routes/joinrequests'));
  app.use(error);
};
