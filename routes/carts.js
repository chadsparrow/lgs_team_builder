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
  });

  if (!cart) return res.status(200).send(null);

  return res.status(200).send(cart);
});

// @desc    Add an item to a cart - creates cart if it doesnt exist
// @route   POST /api/v1/carts/:id
// @access  Private
router.post('/:id', [validateObjectId, auth], async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send([{ message: 'Store with the given ID not found' }]);

  const { storeItemId } = req.body;

  store.items.forEach(el => {
    if (el._id == storeItemId) {
      req.body = { ...req.body, storePrice: parseFloat(el.storePrice) };
    }
  });

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

  const updatedCart = await cart.save();

  return res.status(201).send([{ message: 'Item added to cart', updatedCart }]);
});

// @desc    Updates an item in a cart
// @route   PUT /api/v1/carts/:id/:itemId
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const updatedCart = await Cart.findByIdAndUpdate(
    req.params.id,
    { items: req.body.items },
    { new: true }
  );

  if (!updatedCart) return res.status(400).send([{ message: 'Cart with the given ID not found' }]);

  return res.status(200).send([{ message: 'Cart Updated', updatedCart }]);
});

// @desc    Removes an item from a cart
// @route   DELETE /api/v1/carts/:id/:itemId
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  if (!req.query.itemId)
    return res
      .status(400)
      .send([{ message: "Please include a query with 'itemId' & an ID number" }]);

  const updatedCart = await Cart.findByIdAndUpdate(
    req.params.id,
    {
      $pull: { items: { _id: req.query.itemId } }
    },
    { new: true }
  );
  if (!updatedCart) return res.status(400).send([{ message: 'Cart with the given ID not found' }]);

  return res.status(200).send([{ message: 'Cart Item Removed', updatedCart }]);
});

module.exports = router;
