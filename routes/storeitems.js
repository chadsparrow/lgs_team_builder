/* eslint-disable no-underscore-dangle */
const express = require('express');
const { StoreItem, validateStoreItemEdit } = require('../models/StoreItem');
const { Store } = require('../models/Store');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

// @desc    Get all items for a specific store
// @route   GET /api/v1/storeitems/store/:id
// @access  Private
router.get('/store/:id', [validateObjectId, auth], async (req, res) => {
  const storeitems = await StoreItem.find({ storeId: req.params.id }).sort({ storeIndex: 1 });
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
  const storeitems = await StoreItem.find().sort({ storeIndex: 1 });
  if (storeitems && storeitems.length === 0)
    return res.status(404).send([{ message: 'No store items found' }]);

  return res.send(storeitems);
});

// @desc    Updates store items
// @route   POST /api/v1/storeitems/:id
// @access  Private - admin
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send([{ message: 'Store with the given ID not found' }]);

  await StoreItem.deleteMany({ storeId: store._id });

  req.body.storeItems.forEach(async (item, index) => {
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
      priceBreakGoal
    } = item;
    const storeIndex = index;

    const newItem = new StoreItem({
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
      storeIndex
    });

    await newItem.save();
  });

  return res.status(200).send([{ message: 'Store Items Updated' }]);
});

// @desc    Update a store item
// @route   PUT /api/v1/storeitems/:id
// @access  Private - admin
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStoreItemEdit(req.body);
  if (error) return res.status(400).send(error.details);

  const storeItem = await StoreItem.findById(req.params.id);
  if (!storeItem)
    return res.status(400).send([{ message: 'Store item with the given ID not found' }]);

  const { isActive, sizesOffered, category, name, code, number, mandatory, price } = req.body;

  storeItem.isActive = isActive;
  storeItem.sizesOffered = sizesOffered;
  storeItem.category = category; // MAY NEED TO CHANGE TO ARRAY
  storeItem.name = name;
  storeItem.code = code;
  storeItem.number = number;
  storeItem.mandatory = mandatory;
  storeItem.price = price;

  await storeItem.save();
  return res.send(storeItem);
});

// @desc    Delete a store item
// @route   DELETE /api/v1/storeitems/:id
// @access  Private - admin
router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const storeItem = await StoreItem.findByIdAndDelete(req.params.id);
  if (!storeItem)
    return res.status(400).send([{ message: 'Store item with the given ID not found' }]);

  return res.status(200).send([{ message: 'Store item deleted' }]);
});

module.exports = router;
