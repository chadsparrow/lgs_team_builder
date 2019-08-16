/* eslint-disable no-underscore-dangle */
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

function populateCoupon(couponId) {
  // eslint-disable-next-line no-unused-vars
  return new Promise(async (resolve, reject) => {
    const populatedCoupon = await Coupon.findById(couponId)
      .populate({ path: 'recipients.memberId', select: 'name email' })
      .populate({ path: 'approvedItems' });
    // .populate({ path: 'storeId', select: 'name email' });
    resolve(populatedCoupon);
  });
}

// Collects all coupons from the database, also allows query (?code={code})
router.get('/', auth, async (req, res) => {
  const { filter } = aqp(req.query);
  const coupons = await Coupon.find(filter)
    .populate({ path: 'recipients.memberId', select: 'name email' })
    .populate({ path: 'approvedItems' })
    .select('-updatedAt -__v');
  if (coupons && coupons.length === 0)
    return res.status(404).send([{ message: 'No coupons found.' }]);

  return res.send(coupons);
});

// Collects all coupons for the current authenticated user
router.get('/me', auth, async (req, res) => {
  const coupons = await Coupon.find({ recipients: { $elemMatch: { memberId: req.member._id } } })
    .populate({ path: 'recipients.memberId', select: 'name email' })
    .populate({ path: 'approvedItems' })
    .select('-__v -updatedAt');
  if (coupons && coupons.length === 0)
    return res.status(404).send([{ message: 'You have no coupons.' }]);

  coupons.forEach(async (coupon, index) => {
    coupons[index] = await populateCoupon(coupon._id);
  });

  return res.send(coupons);
});

// Collects all coupons for a specified store based on given ID.
router.get('/store/:id', [validateObjectId, auth], async (req, res) => {
  const coupons = await Coupon.find({ storeId: req.params.id })
    .populate({ path: 'recipients.memberId', select: 'name email' })
    .populate({ path: 'approvedItems' })
    .select('-__v -updatedAt');
  if (coupons && coupons.length === 0)
    return res.status(400).send([{ message: 'Coupons under the given Store ID were not found.' }]);

  return res.send(coupons);
});

// Collects a coupon with a given ID
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const coupon = await Coupon.findById(req.params.id)
    .populate({ path: 'recipients.memberId', select: 'name email' })
    .populate({ path: 'approvedItems' })
    .select('-__v -updatedAt');
  if (!coupon) return res.status(400).send([{ message: 'Coupon with the given ID not found.' }]);

  return res.send(coupon);
});

// Adds a new coupon, cannot make duplicate coupon in a single store
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateCoupon(req.body);
  if (error) return res.status(400).send(error.details);

  const {
    storeId,
    code,
    description,
    discountAmount,
    discountType,
    discountApplied,
    couponType,
    maxCoupons,
    couponsUsed,
    startDate,
    endDate,
    timezone,
    recipients,
    approvedItems
  } = req.body;

  let coupon = await Coupon.findOne({ storeId, code: code.toUpperCase() });
  if (coupon)
    return res.status(400).send([{ message: 'Coupon code already exists for this store.' }]);

  coupon = new Coupon({
    storeId,
    code,
    description,
    discountAmount,
    discountType,
    discountApplied,
    couponType,
    maxCoupons,
    couponsUsed: 0,
    couponsRemaining: parseInt(maxCoupons - couponsUsed, 10),
    timezone,
    startDate: moment.tz(startDate, timezone).format(),
    endDate: moment.tz(endDate, timezone).format(),
    recipients,
    approvedItems
  });

  if (discountApplied !== 'member') {
    coupon.recipients = [];
  }

  if (couponType !== 'items') {
    coupon.approvedItems = [];
  }

  await coupon.save();

  return res.send(await populateCoupon(coupon._id));
});

// Verifies coupon sent by client
router.post('/verify/', [auth], async (req, res) => {
  const coupon = await Coupon.findOne({ storeId: req.query.store, code: req.query.code });
  if (!coupon) return res.status(400).send([{ message: 'Invalid coupon' }]);

  let memberFound = false;
  if (coupon.couponType === 'amount') {
    if (coupon.couponsRemaining === 0)
      return res.status(400).send([{ message: 'Coupon expired.' }]);
  } else if (coupon.couponType === 'member') {
    // eslint-disable-next-line consistent-return
    coupon.recipients.forEach(recipient => {
      if (req.member._id === recipient.memberId) {
        if (recipient.expired === true) {
          return res.status(400).send([{ message: 'Coupon expired.' }]);
        }
        memberFound = true;
      }
    });
  }

  if (memberFound === false) {
    return res.status(400).send([{ message: 'Invalid coupon.' }]);
  }

  return res.status(200).send([{ message: 'Verified' }]);
});

// Updates coupon, but doesnt allow duplicate codes in single store
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCouponEdit(req.body);
  if (error) return res.status(400).send(error.details);

  const {
    code,
    description,
    discountAmount,
    discountType,
    discountApplied,
    couponType,
    maxCoupons,
    couponsUsed,
    timezone,
    recipients,
    approvedItems
  } = req.body;

  let { startDate, endDate } = req.body;

  startDate = moment.tz(startDate, timezone).format();
  endDate = moment.tz(endDate, timezone).format();

  const coupon = await Coupon.findById(req.params.id);
  if (!coupon)
    return res.status(400).send([{ message: 'Coupon with the given ID was not found.' }]);

  const duplicateCoupon = await Coupon.findOne({
    _id: { $ne: req.params.id },
    storeId: coupon.storeId,
    code: code.toUpperCase()
  });

  if (duplicateCoupon)
    return res.status(400).send([{ message: 'Coupon code already exists for this store.' }]);

  coupon.code = code;
  coupon.description = description;
  coupon.discountAmount = discountAmount;
  coupon.discountType = discountType;
  coupon.discountApplied = discountApplied;
  coupon.couponType = couponType;
  coupon.maxCoupons = maxCoupons;
  coupon.couponsUsed = couponsUsed;
  coupon.couponsRemaining = parseInt(coupon.maxCoupons - coupon.couponsUsed, 10);
  coupon.startDate = startDate;
  coupon.endDate = endDate;
  coupon.timezone = timezone;
  coupon.recipients = recipients;
  coupon.approvedItems = approvedItems;

  await coupon.save();

  return res.send(await populateCoupon(coupon._id));
});

router.patch('/use/:id', [validateObjectId, auth], async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon)
    return res.status(400).send([{ message: 'Coupon with the given ID was not found.' }]);
  if (coupon.couponsRemaining === 0)
    return res.status(400).send([{ message: 'Coupon is now expired.' }]);

  coupon.couponsUsed += 1;
  coupon.couponsRemaining = parseInt(coupon.maxCoupons - coupon.couponsUsed, 10);

  await coupon.save();

  return res.send(await populateCoupon(coupon._id));
});

router.patch('/add/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateAddAmount(req.query);
  if (error) return res.status(400).send(error.details);

  const coupon = await Coupon.findById(req.params.id);
  if (!coupon)
    return res.status(400).send([{ message: 'Coupon with the given ID was not found.' }]);

  coupon.maxCoupons += req.body.amount;
  coupon.couponsRemaining = parseInt(coupon.maxCoupons - coupon.couponsUsed, 10);

  await coupon.save();

  return res.send(await populateCoupon(coupon._id));
});

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const coupon = await Coupon.findByIdAndRemove(req.params.id);
  if (!coupon) return res.status(400).send([{ message: 'Coupon with the given ID not found.' }]);

  return res.status(200).send([{ message: 'Coupon Removed.' }]);
});

module.exports = router;
