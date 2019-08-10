/* eslint-disable no-unused-vars */
/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();
const moment = require('moment-timezone');
const aqp = require('api-query-params');

const {
  Coupon,
  validateCoupon,
  validateAddAmount,
  validateCouponEdit
} = require('../models/Coupon');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

function populateCoupon(coupon_id) {
  return new Promise(async (resolve, reject) => {
    const populated_coupon = await Coupon.findById(coupon_id)
      .populate({ path: 'recipients.member_id', select: 'name email' })
      .populate({ path: 'approved_items' });
    // .populate({ path: 'store_id', select: 'name email' });
    resolve(populated_coupon);
  });
}

// Collects all coupons from the database, also allows query (?code={code})
router.get('/', auth, async (req, res) => {
  const { filter } = aqp(req.query);
  const coupons = await Coupon.find(filter)
    .populate({ path: 'recipients.member_id', select: 'name email' })
    .populate({ path: 'approved_items' })
    .select('-updatedAt -__v');
  if (coupons && coupons.length === 0)
    return res.status(404).json({ message: 'No coupons found.' });

  res.json(coupons);
});

// Collects all coupons for the current authenticated user
router.get('/me', auth, async (req, res) => {
  const coupons = await Coupon.find({ recipients: { $elemMatch: { member_id: req.member._id } } })
    .populate({ path: 'recipients.member_id', select: 'name email' })
    .populate({ path: 'approved_items' })
    .select('-__v -updatedAt');
  if (coupons && coupons.length === 0)
    return res.status(404).json({ message: 'You have no coupons.' });

  coupons.forEach(async (coupon, index) => {
    coupons[index] = await populateCoupon(coupon._id);
  });

  res.json(coupons);
});

// Collects all coupons for a specified store based on given ID.
router.get('/store/:id', [validateObjectId, auth], async (req, res) => {
  const coupons = await Coupon.find({ store_id: req.params.id })
    .populate({ path: 'recipients.member_id', select: 'name email' })
    .populate({ path: 'approved_items' })
    .select('-__v -updatedAt');
  if (coupons && coupons.length === 0)
    return res.status(400).json({ message: 'Coupons under the given Store ID were not found.' });

  res.json(coupons);
});

// Collects a coupon with a given ID
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)
    .populate({ path: 'recipients.member_id', select: 'name email' })
    .populate({ path: 'approved_items' })
    .select('-__v -updatedAt');
  if (!coupon) return res.status(400).json({ message: 'Coupon with the given ID not found.' });

  res.json(coupon);
});

// Adds a new coupon, cannot make duplicate coupon in a single store
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateCoupon(req.body);
  if (error) return res.status(400).json(error.details);

  const {
    store_id,
    code,
    description,
    discount_amount,
    discount_type,
    discount_applied,
    coupon_type,
    max_coupons,
    coupons_used,
    start_date,
    end_date,
    timezone,
    recipients,
    approved_items
  } = req.body;

  let coupon = await Coupon.findOne({ store_id, code: code.toUpperCase() });
  if (coupon)
    return res.status(400).json({ message: 'Coupon code already exists for this store.' });

  coupon = new Coupon({
    store_id,
    code,
    description,
    discount_amount,
    discount_type,
    discount_applied,
    coupon_type,
    max_coupons,
    coupons_used: 0,
    coupons_remaining: parseInt(max_coupons - coupons_used, 10),
    timezone,
    start_date: moment.tz(start_date, timezone).format(),
    end_date: moment.tz(end_date, timezone).format(),
    recipients,
    approved_items
  });

  if (discount_applied !== 'member') {
    coupon.recipients = [];
  }

  if (coupon_type !== 'items') {
    coupon.approved_items = [];
  }

  await coupon.save();

  res.json(await populateCoupon(coupon._id));
});

// Verifies coupon sent by client
router.post('/verify/', [auth], async (req, res) => {
  const coupon = await Coupon.findOne({ store_id: req.query.store, code: req.query.code });
  if (!coupon) return res.status(400).json({ message: 'Invalid coupon' });

  let member_found = false;
  if (coupon.coupon_type === 'amount') {
    if (coupon.coupons_remaining === 0) return res.status(400).json({ message: 'Coupon expired.' });
  } else if (coupon.coupon_type === 'member') {
    coupon.recipients.forEach(recipient => {
      if (req.member._id === recipient.member_id) {
        member_found = true;
        if (recipient.expired === true) {
          return res.status(400).json({ message: 'Coupon expired.' });
        }
      }
    });
  }

  if (member_found === false) {
    return res.status(400).json({ message: 'Invalid coupon.' });
  }

  res.status(200).json({ message: 'Verified' });
});

// Updates coupon, but doesnt allow duplicate codes in single store
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCouponEdit(req.body);
  if (error) return res.status(400).json(error.details);

  const {
    code,
    description,
    discount_amount,
    discount_type,
    discount_applied,
    coupon_type,
    max_coupons,
    coupons_used,
    timezone,
    recipients,
    approved_items
  } = req.body;

  let { start_date, end_date } = req.body;

  start_date = moment.tz(start_date, timezone).format();
  end_date = moment.tz(end_date, timezone).format();

  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(400).json({ message: 'Coupon with the given ID was not found.' });

  const duplicate_coupon = await Coupon.findOne({
    _id: { $ne: req.params.id },
    store_id: coupon.store_id,
    code: code.toUpperCase()
  });

  if (duplicate_coupon)
    return res.status(400).json({ message: 'Coupon code already exists for this store.' });

  coupon.code = code;
  coupon.description = description;
  coupon.discount_amount = discount_amount;
  coupon.discount_type = discount_type;
  coupon.discount_applied = discount_applied;
  coupon.coupon_type = coupon_type;
  coupon.max_coupons = max_coupons;
  coupon.coupons_used = coupons_used;
  coupon.coupons_remaining = parseInt(coupon.max_coupons - coupon.coupons_used, 10);
  coupon.start_date = start_date;
  coupon.end_date = end_date;
  coupon.timezone = timezone;
  coupon.recipients = recipients;
  coupon.approved_items = approved_items;

  await coupon.save();

  res.json(await populateCoupon(coupon._id));
});

router.patch('/use/:id', [validateObjectId, auth], async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(400).json({ message: 'Coupon with the given ID was not found.' });
  if (coupon.coupons_remaining === 0)
    return res.status(400).json({ message: 'Coupon is now expired.' });

  coupon.coupons_used += 1;
  coupon.coupons_remaining = parseInt(coupon.max_coupons - coupon.coupons_used, 10);

  await coupon.save();

  res.json(await populateCoupon(coupon._id));
});

router.patch('/add/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateAddAmount(req.query);
  if (error) return res.status(400).json(error.details);

  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(400).json({ message: 'Coupon with the given ID was not found.' });

  coupon.max_coupons += req.body.amount;
  coupon.coupons_remaining = parseInt(coupon.max_coupons - coupon.coupons_used, 10);

  await coupon.save();

  res.json(await populateCoupon(coupon._id));
});

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const coupon = await Coupon.findByIdAndRemove(req.params.id);
  if (!coupon) return res.status(400).json({ message: 'Coupon with the given ID not found.' });

  res.status(200).json({ message: 'Coupon Removed.' });
});

module.exports = router;
