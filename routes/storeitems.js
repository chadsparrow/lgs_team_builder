/* eslint-disable camelcase */
/* eslint-disable consistent-return */
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

// GET /api/storeitems/store/<store_id>
// DESC - Get all store items linked to a given store id
// ACCESS - Private
router.get('/store/:id', [validateObjectId, auth], async (req, res) => {
  const storeitems = await StoreItem.find({ store_id: req.params.id });
  if (storeitems && storeitems.length === 0)
    return res.status(404).json({ message: 'No store items found' });

  res.json(storeitems);
});

// GET /api/storeitems/<item_id>
// DESC - Get a specific store item based on a given item id
// ACCESS - Private
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const storeitem = await StoreItem.findById(req.params.id);
  if (!storeitem)
    return res.status(400).json({ message: 'Store item with the given ID not found' });

  res.json(storeitem);
});

// GET /api/storeitems/all
// DESC - Get all store item in the database
// ACCESS - Private - Admin only
router.get('/all', [auth, admin], async (req, res) => {
  const storeitems = await StoreItem.find();
  if (storeitems && storeitems.length === 0)
    return res.status(404).json({ message: 'No store items found' });

  res.json(storeitems);
});

// POST /api/storeitems/<store_id>
// DESC - Add a new store item into store based on given ID
// ACCESS - Private - Admin only
router.post('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStoreItem(req.body);
  if (error) return res.status(400).json(error.details);

  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).json({ message: 'Store with the given ID not found' });

  const catalogitem = await CatalogItem.findById(req.body.item_id);
  if (!catalogitem)
    return res.status(400).json({ message: 'Catalog item with the given ID not found' });

  const {
    store_id,
    item_id,
    is_active,
    sizes_offered,
    category,
    name,
    code,
    number,
    images,
    mandatory,
    price
  } = req.body;

  const storeItem = new StoreItem({
    store_id,
    item_id,
    is_active,
    sizes_offered,
    category,
    name,
    code,
    number,
    images,
    mandatory,
    price
  });

  await storeItem.save();
  res.json(storeItem);
});

// PUT /api/storeitems/<item_id>
// DESC - Edit a store item based on given ID (not images)
// ACCESS - Private - Admin only
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStoreItemEdit(req.body);
  if (error) return res.status(400).json(error.details);

  const storeItem = await StoreItem.findById(req.params.id);
  if (!storeItem)
    return res.status(400).json({ message: 'Store item with the given ID not found' });

  const { is_active, sizes_offered, category, name, code, number, mandatory, price } = req.body;

  storeItem.is_active = is_active;
  storeItem.sizes_offered = sizes_offered;
  storeItem.category = category;
  storeItem.name = name;
  storeItem.code = code;
  storeItem.number = number;
  storeItem.mandatory = mandatory;
  storeItem.price = price;

  await storeItem.save();
  res.json(storeItem);
});

// PATCH /api/storeitems/<item_id>/images?index=<image index number>
// DESC - Edit a store item images based on a given ID
// ACCESS - Private - Admin only
router.patch('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStoreItemImage(req.body);
  if (error) return res.status(400).json(error.details);

  const storeItem = await StoreItem.findById(req.params.id);

  const { index } = req.query;
  storeItem.images[index].image_url = req.body.image_url;
  storeItem.images[index].name = req.body.name;

  await storeItem.save();
  res.json(storeItem);
});

// DELETE /api/storeitems/<item_id>
// DESC - Delete a store item based on a given ID
// ACCESS - Private - Admin only
router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const storeItem = await StoreItem.findByIdAndDelete(req.params.id);
  if (!storeItem)
    return res.status(400).json({ message: 'Store item with the given ID not found' });

  res.status(200).json({ message: 'Store item deleted' });
});

module.exports = router;
