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

// GET /api/storeitems/store/<storeId>
// DESC - Get all store items linked to a given store id
// ACCESS - Private
router.get('/store/:id', [validateObjectId, auth], async (req, res) => {
  const storeitems = await StoreItem.find({ storeId: req.params.id });
  if (storeitems && storeitems.length === 0)
    return res.status(404).send([{ message: 'No store items found' }]);

  return res.send(storeitems);
});

// GET /api/storeitems/<itemId>
// DESC - Get a specific store item based on a given item id
// ACCESS - Private
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const storeitem = await StoreItem.findById(req.params.id);
  if (!storeitem)
    return res.status(400).send([{ message: 'Store item with the given ID not found' }]);

  return res.send(storeitem);
});

// GET /api/storeitems/all
// DESC - Get all store item in the database
// ACCESS - Private - Admin only
router.get('/all', [auth, admin], async (req, res) => {
  const storeitems = await StoreItem.find();
  if (storeitems && storeitems.length === 0)
    return res.status(404).send([{ message: 'No store items found' }]);

  return res.send(storeitems);
});

// POST /api/storeitems/<storeId>
// DESC - Add a new store item into store based on given ID
// ACCESS - Private - Admin only
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

// PUT /api/storeitems/<itemId>
// DESC - Edit a store item based on given ID (not images)
// ACCESS - Private - Admin only
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStoreItemEdit(req.body);
  if (error) return res.status(400).send(error.details);

  const storeItem = await StoreItem.findById(req.params.id);
  if (!storeItem)
    return res.status(400).send([{ message: 'Store item with the given ID not found' }]);

  const { isActive, sizesOffered, category, name, code, number, mandatory, price } = req.body;

  storeItem.isActive = isActive;
  storeItem.sizesOffered = sizesOffered;
  storeItem.category = category;
  storeItem.name = name;
  storeItem.code = code;
  storeItem.number = number;
  storeItem.mandatory = mandatory;
  storeItem.price = price;

  await storeItem.save();
  return res.send(storeItem);
});

// PATCH /api/storeitems/<itemId>/images?index=<image index number>
// DESC - Edit a store item images based on a given ID
// ACCESS - Private - Admin only
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

// DELETE /api/storeitems/<itemId>
// DESC - Delete a store item based on a given ID
// ACCESS - Private - Admin only
router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const storeItem = await StoreItem.findByIdAndDelete(req.params.id);
  if (!storeItem)
    return res.status(400).send([{ message: 'Store item with the given ID not found' }]);

  return res.status(200).send([{ message: 'Store item deleted' }]);
});

module.exports = router;
