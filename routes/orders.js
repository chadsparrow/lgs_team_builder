/* eslint-disable no-underscore-dangle */
const express = require('express');

const router = express.Router();
const { Order, validateOrder } = require('../models/Order');
const { Store } = require('../models/Store');
const { Member } = require('../models/Member');
const { Team } = require('../models/Team');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

// @desc    Gets all orders
// @route   GET /api/v1/orders/
// @access  Private
router.get('/', auth, async (req, res) => {
  let orders = [];

  // Gets all orders if current user is an admin
  if (req.member.isAdmin) {
    orders = await Order.find()
      .populate({ path: 'memberId', select: 'name email' })
      .populate({ path: 'teamId', select: 'name' })
      .select('-updatedAt -__v ');
    if (orders && orders.length === 0)
      return res.status(404).send([{ message: 'No orders found.' }]);

    return res.send(orders);
  }

  // Gets only orders owned by the current user
  orders = await Order.find({ memberId: req.member._id })
    .populate({ path: 'memberId', select: 'name email' })
    .select('-updatedAt -__v');

  if (orders && orders.length === 0)
    return res.status(404).send([{ message: 'You currently do not have any orders.' }]);

  return res.send(orders);
});

// @desc    Gets all orders for a specific team
// @route   GET /api/v1/orders/team/:id
// @access  Private - Admin
router.get('/team/:id', [validateObjectId, auth, admin], async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(400).send([{ message: 'Team with the given ID not found' }]);

  const orders = await Order.find({ teamId: req.params.id });
  if (orders && orders.length === 0)
    return res.status(404).send([{ message: 'No orders found for the given team ID' }]);

  return res.send(orders);
});

// @desc    Get all orders for a specific member
// @route   GET /api/v1/orders/member/:id
// @access  Private - admin
router.get('/member/:id', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(400).send([{ message: 'Member with the given ID not found' }]);

  const orders = await Order.find({ memberId: req.params.id });
  if (orders && orders.length === 0)
    return res.status(404).send([{ message: 'No orders found for the given member ID' }]);

  return res.send(orders);
});

// @desc    Get all orders for a specific store
// @route   GET /api/v1/orders/store/:id
// @access  Private
router.get('/store/:id', [validateObjectId, auth, admin], async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send([{ message: 'Store with given ID not found' }]);

  const orders = await Order.find({ storeId: req.params.id });
  if (orders && orders.length === 0)
    return res.status(404).send([{ message: 'No orders found for the given store ID' }]);

  return res.send(orders);
});

// @desc    Add a new order
// @route   POST /api/v1/orders/
// @access  Private
router.post('/', auth, async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) return res.status(400).send(error.details);

  const member = await Member.findById(req.body.memberId);
  if (!member) return res.status(400).send([{ message: 'Member with the given ID not found' }]);

  const team = await Team.findById(req.body.teamId);
  if (!team) return res.status(400).send([{ message: 'Team with the given ID not found' }]);

  const store = await Store.findById(req.body.storeId);
  if (!store) return res.status(400).send([{ message: 'Store with the given ID not found' }]);

  const {
    storeId,
    teamId,
    memberId,
    dropContact,
    dropAddress1,
    dropAddress2,
    dropCity,
    dropStateProv,
    dropCountry,
    dropZipPostal,
    dropPhone,
    dropEmail,
    couponId,
    orderDiscount,
    taxPercentage,
    items
  } = req.body;

  const order = new Order({
    storeId,
    teamId,
    memberId,
    couponId,
    orderDiscount,
    taxPercentage,
    orderDate: new Date(),
    items
  });

  if (store.shipping.shippingType === 'DROP') {
    order.dropShipping.contact = dropContact;
    order.dropShipping.address1 = dropAddress1;
    if (dropAddress2) order.dropShipping.address2 = dropAddress2;

    order.dropShipping.city = dropCity;
    order.dropShipping.stateProv = dropStateProv;
    order.dropShipping.country = dropCountry;
    order.dropShipping.zipPostal = dropZipPostal;
    order.dropShipping.phone = dropPhone;
    order.dropShipping.email = dropEmail;
  }

  let itemsTotal = 0;
  items.forEach(item => {
    itemsTotal += (item.price - item.discount) * item.quantity;
  });

  order.subTotal = itemsTotal;
  //  REPLACE TAX CALCULATIONS WITH AVALARA API CALLS
  const taxAmount = (order.subTotal - order.discount) * (order.taxPercentage / 100);
  order.totalAmount = order.subTotal - order.discount + taxAmount;

  order.balanceOwing = order.totalAmount - order.amount_paid;

  await order.save();
  return res.send(order);
});

module.exports = router;
