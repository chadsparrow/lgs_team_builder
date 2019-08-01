const { Coupon, validateCoupon, validateAddAmount, validateCouponEdit } = require('../models/Coupon');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const moment = require('moment-timezone');

const populateOptions = { path: 'recipients', select: 'name email' };

// Collects all coupons from the database
router.get('/', auth, async (req, res) => {
  const coupons = await Coupon.find()
    .populate(populateOptions)
    .select('-updatedAt -__v');
  if (coupons && coupons.length === 0) return res.status(404).send({ msg: 'No coupons found.' });

  res.send(coupons);
});

// Collects all coupons for a specified store based on given ID.
router.get('/store/:id', [validateObjectId, auth], async (req, res) => {
  const coupons = await Coupon.find({ store_id: req.params.id })
    .populate(populateOptions)
    .select('-__v -updatedAt');
  if (coupons && coupons.length === 0) return res.status(400).send({ msg: 'Coupons under the given Store ID were not found.' });

  res.send(coupons);
});

// Collects all coupons for the current authenticated user
router.get('/me', auth, async (req, res) => {
  const coupons = await Coupon.find({ recipients: req.member._id })
    .populate(populateOptions)
    .select('-__v -updatedAt');
  if (coupons && coupons.length === 0) return res.status(404).send({ msg: 'You have no coupons.' });

  coupons.forEach(async coupon => {
    coupon = await populateCoupon(coupon._id);
  });

  res.send(coupons);
});

// Collects all coupons with a given code number
router.get('/c/:code', auth, async (req, res) => {
  const coupons = await Coupon.find({ code: req.params.code })
    .populate(populateOptions)
    .select('-__v -updatedAt');
  if (coupons && coupons.length == 0) return res.status(400).send({ msg: 'Coupons with the given code were not found.' });

  res.send(coupons);
});

// Collects a coupon with a given ID
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)
    .populate(populateOptions)
    .select('-__v -updatedAt');
  if (!coupon) return res.status(400).send({ msg: 'Coupon with the given ID not found.' });

  res.send(coupon);
});

// Adds a new coupon, cannot make duplicate coupon in a single store
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateCoupon(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let {
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

  let coupon = await Coupon.findOne({ store_id: store_id, code: code.toUpperCase() });
  if (coupon) return res.status(400).send({ msg: 'Coupon code already exists for this store.' });

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
    coupons_remaining: parseInt(max_coupons - coupons_used),
    timezone,
    start_date: moment.tz(start_date, timezone).format(),
    end_date: moment.tz(end_date, timezone).format(),
    recipients,
    approved_items
  });

  await coupon.save();

  res.send(await populateCoupon(coupon._id));
});

// Verifies coupon sent by client
router.post('/verify/', [auth], async (req, res) => {
  const coupon = await Coupon.findOne({ store_id: req.query.store, code: req.query.code });
  if (!coupon) return res.status(400).send({ msg: 'Invalid coupon' });

  if (coupon_type === 'amount') {
    if (coupon.coupons_remaining === 0) return res.status(400).send({ msg: 'Coupon expired.' });
  } else if (coupon_type === 'member') {
    coupon.recipients.forEach(recipient => {
      if (req.member._id == recipient.member) {
        memberFound = true;
        if (recipient.expired == true) {
          return res.status(400).send({ msg: 'Coupon expired.' });
        }
      }
    });
  }

  if (memberFound === false) {
    return res.status(400).send({ msg: 'Invalid coupon.' });
  }

  res.status(200).send({ msg: 'Verified' });
});

// Updates coupon, but doesnt allow duplicate codes in single store
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCouponEdit(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let {
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

  start_date = moment.tz(start_date, timezone).format();
  end_date = moment.tz(end_date, timezone).format();

  let coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(400).send({ msg: 'Coupon with the given ID was not found.' });

  const dupCoupon = await Coupon.findOne({ _id: { $ne: req.params.id }, store_id: coupon.store_id, code: code.toUpperCase() });

  if (dupCoupon) return res.status(400).send({ msg: 'Coupon code already exists for this store.' });

  coupon.code = code;
  coupon.description = description;
  coupon.discount_amount = discount_amount;
  coupon.discount_type = discount_type;
  coupon.discount_applied = discount_applied;
  coupon.coupon_type = coupon_type;
  coupon.max_coupons = max_coupons;
  coupon.coupons_used = coupons_used;
  coupon.coupons_remaining = parseInt(coupon.max_coupons - coupon.coupons_used);
  coupon.start_date = start_date;
  coupon.end_date = end_date;
  coupon.timezone = timezone;
  coupon.recipients = recipients;
  coupon.approved_items = approved_items;

  await coupon.save();

  res.send(await populateCoupon(coupon._id));
});

router.patch('/use/:id', [validateObjectId, auth], async (req, res) => {
  let coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(400).send({ msg: 'Coupon with the given ID was not found.' });
  if (coupon.coupons_remaining === 0) return res.status(400).send({ msg: 'Coupon is now expired.' });

  coupon.coupons_used += 1;
  coupon.coupons_remaining = parseInt(coupon.max_coupons - coupon.coupons_used);

  await coupon.save();

  res.send(await populateCoupon(coupon._id));
});

router.patch('/add/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateAddAmount(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(400).send({ msg: 'Coupon with the given ID was not found.' });

  coupon.max_coupons += req.body.amount;
  coupon.coupons_remaining = parseInt(coupon.max_coupons - coupon.coupons_used);

  await coupon.save();

  res.send(await populateCoupon(coupon._id));
});

function populateCoupon(couponId) {
  return new Promise(async (resolve, reject) => {
    let popcoupon = await Coupon.findById(couponId).populate(populateOptions);
    //.populate({ path: 'store_id', select: 'name email' });
    resolve(popcoupon);
  });
}

module.exports = router;
