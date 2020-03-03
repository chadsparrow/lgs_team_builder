const logger = require('../middleware/logger');
const { Cart } = require('../models/Cart');
const { Store } = require('../models/Store');

module.exports = {
  // @desc    Get current members cart for specific store
  // @route   GET /api/v1/carts/:id
  // @access  Private
  getCart: async (req, res, next) => {
    try {
      const store = await Store.findById(req.params.id);
      if (!store) return res.status(400).send([{ message: 'Store with the given ID not found' }]);

      const cart = await Cart.findOne({
        memberId: req.member._id,
        storeId: store._id
      });

      if (!cart) return res.status(200).send(null);

      return res.status(200).send(cart);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Add an item to a cart - creates cart if it doesnt exist
  // @route   POST /api/v1/carts/:id
  // @access  Private
  addToCart: async (req, res, next) => {
    try {
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
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Updates an item in a cart
  // @route   PUT /api/v1/carts/:id/:itemId
  // @access  Private
  updateCartItem: async (req, res, next) => {
    try {
      const updatedCart = await Cart.findByIdAndUpdate(
        req.params.id,
        { items: req.body.items },
        { new: true }
      );

      if (!updatedCart)
        return res.status(400).send([{ message: 'Cart with the given ID not found' }]);

      return res.status(200).send([{ message: 'Cart Updated', updatedCart }]);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Removes an item from a cart
  // @route   DELETE /api/v1/carts/:id/:itemId
  // @access  Private
  deleteCartItem: async (req, res, next) => {
    try {
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

      if (!updatedCart)
        return res.status(400).send([{ message: 'Cart with the given ID not found' }]);

      return res.status(200).send([{ message: 'Cart Item Removed', updatedCart }]);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Removes an item from all carts
  // @route   DELETE /api/v1/carts/removeitems/:id
  // @access  Private - admin
  removeItemFromAllCarts: async (req, res, next) => {
    try {
      await Cart.updateMany(
        { 'items.storeItemId': req.params.id },
        { $pull: { items: { storeItemId: req.params.id } } }
      );

      return res.status(200).send([{ message: 'Item removed from all carts' }]);
    } catch (err) {
      logger.error(err);
    }
  }
};
