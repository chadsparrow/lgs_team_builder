/* eslint-disable no-underscore-dangle */
const express = require('express');
const { StoreItem } = require('../models/StoreItem');
const { Store } = require('../models/Store');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

// @desc    Get all items for a specific store
// @route   GET /api/v1/storeitems/store/:id
// @access  Private
router.get('/store/:id', [validateObjectId, auth], async (req, res) => {
  const storeitems = await StoreItem.find({ storeId: req.params.id });
  if (storeitems && storeitems.length === 0)
    return res.status(404).send([{ message: 'No store items found' }]);

  return res.send(storeitems);
});

// @desc    Get a specific store item
// @route   GET /api/v1/storeitems/:id
// @access  Private
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const storeitem = await StoreItem.findById(req.params.id);
  if (!storeitem)
    return res.status(400).send([{ message: 'Store item with the given ID not found' }]);

  return res.send(storeitem);
});

// @desc    Get all store items
// @route   GET /api/v1/storeitems/all
// @access  Private - admin
router.get('/all', [auth, admin], async (req, res) => {
  const storeitems = await StoreItem.find();
  if (storeitems && storeitems.length === 0)
    return res.status(404).send([{ message: 'No store items found' }]);

  return res.send(storeitems);
});

// @desc    Updates store items
// @route   PUT /api/v1/storeitems/:id
// @access  Private - admin
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send([{ message: 'Store with the given ID not found' }]);

  await StoreItem.deleteMany({ storeId: store._id });

  const { storeItems } = req.body;

  storeItems.forEach(async item => {
    const {
      storeId,
      itemId,
      catalogId,
      brand,
      isActive,
      sizes,
      gender,
      categories,
      nameEN,
      nameFR,
      descriptionEN,
      descriptionFR,
      productCode,
      styleCode,
      refNumber,
      images,
      mandatoryItem,
      price,
      priceBreakGoal,
      surveyLikedBy
    } = item;

    await StoreItem.create({
      storeId,
      itemId,
      catalogId,
      brand,
      isActive,
      sizes,
      gender,
      categories,
      nameEN,
      nameFR,
      descriptionEN,
      descriptionFR,
      productCode,
      styleCode,
      refNumber,
      images,
      mandatoryItem,
      price,
      priceBreakGoal,
      surveyLikedBy
    });
  });

  await StoreItem.find({ storeId: store._id });

  return res.status(200).send([{ message: 'Store Items Updated' }]);
});

// @desc    Remove member like from store item
// @route   PUT /api/v1/storeitems/:id/removelike
// @access  Private
router.put('/:id/removelike', [validateObjectId, auth], async (req, res) => {
  const item = await StoreItem.findById(req.params.id);
  if (!item) return res.status(400).send([{ message: 'Store item with the given ID not found' }]);

  if (item.surveyLikedBy.includes(req.member._id)) {
    await StoreItem.findByIdAndUpdate(req.params.id, { $pull: { surveyLikedBy: req.member._id } });
  }

  return res.status(200).send([{ message: 'Updated' }]);
});

// @desc    Add like for member to store item
// @route   PUT /api/v1/storeitems/:id/addlike
// @access  Private
router.put('/:id/addlike', [validateObjectId, auth], async (req, res) => {
  const item = await StoreItem.findById(req.params.id);
  if (!item) return res.status(400).send([{ message: 'Store item with the given ID not found' }]);

  if (item.surveyLikedBy.includes(req.member._id)) {
    return res.status(400).send([{ message: 'Already liked by this member' }]);
  }

  await StoreItem.findByIdAndUpdate(req.params.id, { $push: { surveyLikedBy: req.member._id } });

  return res.status(200).send([{ message: 'Updated' }]);
});

module.exports = router;
