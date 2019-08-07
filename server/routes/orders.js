const express = require('express');
const router = express.Router();
const { Order, validateOrder } = require('../models/Order');
const { Store } = require('../models/Store');
const { StoreItem } = require('../models/StoreItem');
const { Member } = require('../models/Member');
const { Team } = require('../models/Team');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

router.get('/all', [auth, admin], async (req, res) => {
  const orders = await Order.find();
  if (orders && orders.length === 0) return res.status(404).send({ message: 'No orders found' });

  res.json(orders);
});

router.get('/me', [auth], async (req, res) => {
  const orders = await Order.find({ member_id: req.member._id });
  if (orders && orders.length === 0) return res.status(404).send({ message: 'No orders found' });

  res.json(orders);
});

router.get('/team/:id', [validateObjectId, auth], async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(400).send({ message: 'Team with the given ID not found' });

  if (req.member._id !== team.manager_id || !req.member.isAdmin) return res.status(403).send({ message: 'Access Denied' });

  const orders = await Order.find({ team_id: req.params.id });
  if (orders && orders.length === 0) return res.status(404).send({ message: 'No orders found for the given Team ID' });

  res.json(orders);
});

router.get('/member/:id', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(400).send({ message: 'Member with the given ID not found' });

  const orders = await Order.find({ member_id: req.params.id });
  if (orders && orders.length === 0) return res.status(404).send({ message: 'No orders found for the given Member ID' });

  res.json(orders);
});

router.get('/store/:id', [validateObjectId, auth], async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send({ message: 'Store with given ID not found' });

  if (req.member._id !== store.manager_id || !req.member.isAdmin) return res.status(403).send({ message: 'Access Denied' });

  const orders = await Order.find({ store_id: req.params.id });
  if (orders && orders.length === 0) return res.status(404).send({ message: 'No orders found for the given Store ID' });

  res.json(orders);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) return res.status(400).send(error.details);

  const member = await Member.findById(req.body.member_id);
  if (!member) return res.status(400).send({ message: 'Member with the given ID not found' });

  const team = await Team.findById(req.body.team_id);
  if (!team) return res.status(400).send({ message: 'Team with the given ID not found' });

  const store = await Store.findById(req.body.store_id);
  if (!store) return res.status(400).send({ message: 'Store with the given ID not found' });

  let {
    store_id,
    team_id,
    member_id,
    drop_contact,
    drop_address1,
    drop_address2,
    drop_city,
    drop_state_prov,
    drop_country,
    drop_zip_postal,
    drop_phone,
    drop_email,
    coupon_used,
    order_discount,
    tax_percentage,
    amount_paid,
    order_date,
    items
  } = req.body;

  let order = new Order({
    store_id,
    team_id,
    member_id,
    coupon_used,
    order_discount,
    tax_percentage,
    amount_paid,
    order_date: Date.now(),
    items
  });

  if (store.shipping.shipping_type === 'DROP') {
    order.drop_shipping.contact = drop_contact;
    order.drop_shipping.address1 = drop_address1;
    if (drop_address2) order.drop_shipping.address2 = drop_address2;

    order.drop_shipping.city = drop_city;
    order.drop_shipping.state_prov = drop_state_prov;
    order.drop_shipping.country = drop_country;
    order.drop_shipping.zip_postal = drop_zip_postal;
    order.drop_shipping.phone = drop_phone;
    order.drop_shipping.email = drop_email;
  }

  let itemsTotal = 0;
  items.forEach(item => {
    itemsTotal += (item.price - item.discount) * item.quantity;
  });

  order.sub_total = itemsTotal;
  const taxAmount = (order.sub_total - order.discount) * (order.tax_percentage / 100);
  order.total_amount = order.sub_total - order.discount + taxAmount;

  order.balance_owing = order.total_amount - order.amount_paid;

  await order.save();
  res.json(order);
});

module.exports = router;
