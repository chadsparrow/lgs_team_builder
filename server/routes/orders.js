const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const ordersController = require('../controllers/orders');

router
  .route('/')
  .get(auth, ordersController.getOrders)
  .post(auth, ordersController.addOrder);

router.route('/team/:id').get(validateObjectId, auth, admin, ordersController.getTeamOrders);

router.route('/member/:id').get(validateObjectId, auth, admin, ordersController.getMemberOrders);

router.route('/store/:id').get(validateObjectId, auth, admin, ordersController.getStoreOrders);

module.exports = router;
