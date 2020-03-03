const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const cartsController = require('../controllers/carts');

router
  .route('/:id')
  .get(validateObjectId, auth, cartsController.getCart)
  .post(validateObjectId, auth, cartsController.addToCart)
  .put(validateObjectId, auth, cartsController.updateCartItem)
  .delete(validateObjectId, auth, cartsController.deleteCartItem);

router
  .route('/removeitems/:id')
  .delete(validateObjectId, auth, admin, cartsController.removeItemFromAllCarts);

module.exports = router;
