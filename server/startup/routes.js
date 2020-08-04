const error = require('../middleware/error');

// all routes used by the front end - points to single route file in 'routes" folder which houses full endpoints
module.exports = function (app) {
  app.use('/api/v1/members', require('../routes/members'));
  app.use('/api/v1/auth', require('../routes/auth'));
  app.use('/api/v1/notifications', require('../routes/notifications'));
  app.use('/api/v1/teams', require('../routes/teams'));
  app.use('/api/v1/coupons', require('../routes/coupons'));
  app.use('/api/v1/catalogs', require('../routes/catalogs'));
  app.use('/api/v1/catalogitems', require('../routes/catalogitems'));
  app.use('/api/v1/stores', require('../routes/stores'));
  app.use('/api/v1/orders', require('../routes/orders'));
  app.use('/api/v1/carts', require('../routes/carts'));
  app.use('/api/v1/uploads', require('../routes/uploads'));
  app.use(error);
};
