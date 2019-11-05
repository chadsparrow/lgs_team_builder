const express = require('express');
const {
  StoreItem,
  validateStoreItem,
  validateStoreItemEdit,
  validateStoreItemImage
} = require('../models/StoreItem');
const { Store } = require('../models/Store');
const { CatalogItem } = require('../models/CatalogItem');

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

// @desc    Add a new item to a store - using catalog item ID as itemId
// @route   POST /api/v1/storeitems/:id
// @access  Private - admin
router.post('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStoreItem(req.body);
  if (error) return res.status(400).send(error.details);

  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send([{ message: 'Store with the given ID not found' }]);

  const catalogitem = await CatalogItem.findById(req.body.itemId);
  if (!catalogitem)
    return res.status(400).send([{ message: 'Catalog item with the given ID not found' }]);

  const {
    storeId,
    itemId,
    isActive,
    sizesOffered,
    category,
    name,
    code,
    number,
    images,
    mandatory,
    price
  } = req.body;

  // MAY NEED TO CHANGE CATEGORY to ARRAY - confirm

  const storeItem = new StoreItem({
    storeId,
    itemId,
    isActive,
    sizesOffered,
    category,
    name,
    code,
    number,
    images,
    mandatory,
    price
  });

  await storeItem.save();
  return res.send(storeItem);
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

// @desc    Update image for store item
// @route   PATCH /api/v1/storeitems/:id?index=index
// @access  Private - admin
router.patch('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStoreItemImage(req.body);
  if (error) return res.status(400).send(error.details);

  const storeItem = await StoreItem.findById(req.params.id);

  const { index } = req.query;
  storeItem.images[index].imageUrl = req.body.imageUrl;
  storeItem.images[index].name = req.body.name;

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
