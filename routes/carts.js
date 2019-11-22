/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const { Cart } = require('../models/Cart');
const { Store } = require('../models/Store');

const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// @desc    Get current members cart for specific store
// @route   GET /api/v1/carts/:id
// @access  Private
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send([{ message: 'Store with the given ID not found' }]);

  const cart = await Cart.findOne({
    memberId: req.member._id,
    storeId: store._id
  }).populate({
    path: 'items.storeItemId',
    select: 'images categories price nameEN productCode styleCode refNumber mandatoryItem'
  });

  if (!cart) {
    return res.status(200).send(null);
  }

  return res.status(200).send(cart);
});

// @desc    Add an item to a cart - creates cart if it doesnt exist
// @route   POST /api/v1/carts/:id
// @access  Private
router.post('/:id', [validateObjectId, auth], async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send([{ message: 'Store with the given ID not found' }]);

  let cart = await Cart.findOne({ storeId: store._id, memberId: req.member._id });
  if (!cart) {
    cart = new Cart({
      memberId: req.member._id,
      storeId: store._id,
      currency: store.currency,
      items: []
    });
  }
  cart.items.push(req.body);

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate({
    path: 'items.storeItemId',
    select: 'images categories price nameEN productCode styleCode refNumber mandatoryItem'
  });

  return res.status(201).send([{ message: 'Cart Updated', updatedCart }]);
});

module.exports = router;
