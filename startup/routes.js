/* eslint-disable func-names */
/* eslint-disable global-require */
const error = require('../middleware/error');

module.exports = function(app) {
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
  app.use(error);
};
