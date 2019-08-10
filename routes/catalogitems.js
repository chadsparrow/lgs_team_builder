/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();
const {
  CatalogItem,
  validateCatalogItem,
  validateCatalogItemEdit,
  validateCatalogImg
} = require('../models/CatalogItem');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

const populateOptions = { path: 'catalog_id', select: 'brand season year' };

function populateCatalogItem(catalog_item) {
  return new Promise(async resolve => {
    const populated_catalog_item = await CatalogItem.findById(catalog_item).populate(
      populateOptions
    );
    resolve(populated_catalog_item);
  });
}

// Collects all catalog items
router.get('/', auth, async (req, res) => {
  const items = await CatalogItem.find().populate(populateOptions);
  if (items && items.length === 0)
    return res.status(404).json({ message: 'There are no catalog items.' });

  res.json(items);
});

// Collects all items from a specific catalog item based on given ID
router.get('/catalog/:id', [validateObjectId, auth], async (req, res) => {
  const items = await CatalogItem.find({ catalog_id: req.params.id });
  if (items && items.length === 0)
    return res.status(400).json({ message: 'Catalog with the given ID has no items.' });

  res.json(items);
});

// Collects an item based on a given ID
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const item = await CatalogItem.findById(req.params.id).populate(populateOptions);
  if (!item) return res.status(400).json({ message: 'Catalog Item with the given ID not found.' });

  res.json(item);
});

// adds a new catalog item, doesnt allow duplicates
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateCatalogItem(req.body);
  if (error) return res.status(400).json(error.details);

  const {
    catalog_id,
    name,
    product_code,
    style_code,
    sizes,
    price,
    gender,
    description,
    category,
    images,
    is_active
  } = req.body;

  let item = await CatalogItem.findOne({
    catalog_id,
    product_code: product_code.toUpperCase(),
    style_code: style_code.toUpperCase()
  });
  if (item) return res.status(400).json({ message: 'Product already exists.' });

  item = new CatalogItem({
    catalog_id,
    name,
    product_code,
    style_code,
    sizes,
    price,
    gender,
    description,
    category,
    images,
    is_active
  });

  await item.save();
  res.json(await populateCatalogItem(item._id));
});

// Edits a certain item in a catalog, doesnt allow duplicates
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalogItemEdit(req.body);
  if (error) return res.status(400).json(error.details);

  const {
    name,
    product_code,
    style_code,
    sizes,
    price,
    gender,
    description,
    category,
    images,
    is_active
  } = req.body;

  const item = await CatalogItem.findById(req.params.id);
  if (!item) return res.status(400).json({ message: 'Item with the given ID not found.' });

  const duplicate_item = await CatalogItem.findOne({
    _id: { $ne: req.params.id },
    catalog_id: item.catalog_id,
    product_code: product_code.toUpperCase(),
    style_code: style_code.toUpperCase()
  });
  if (duplicate_item) return res.status(400).json({ message: 'Item already exists.' });

  item.name = name;
  item.product_code = product_code;
  item.style_code = style_code;
  item.sizes = sizes;
  item.price = price;
  item.gender = gender;
  item.description = description;
  item.category = category;
  item.images = images;
  item.is_active = is_active;

  await item.save();
  res.json(populateCatalogItem(item._id));
});

// adds an image URI to the items image array
router.patch('/img/add/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalogImg(req.body);
  if (error) return res.status(400).json(error.details);

  const item = await CatalogItem.findById(req.params.id);
  if (!item) return res.status(400).json({ message: 'Catalog Item with the given ID not found.' });

  item.images.push(req.body.image_url);
  await item.save();

  res.json(populateCatalogItem(item._id));
});

// edits an image URI in items image array
router.patch('/img/edit/:id/:index', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalogImg(req.body);
  if (error) return res.status(400).json(error.details);

  const item = await CatalogItem.findById(req.params.id);
  if (!item) return res.status(400).json({ message: 'Catalog Item with the given ID not found.' });

  item.images[req.params.index] = req.body.image_url;
  await item.save();

  res.json(populateCatalogItem(item._id));
});

router.delete('/img/delete/:id/:index', [validateObjectId, auth, admin], async (req, res) => {
  const item = await CatalogItem.findById(req.params.id);
  if (!item) return res.status(400).json({ message: 'Catalog Item with the given ID not found.' });
  const filtered_images = item.images.filter((image, index) => {
    return index !== req.params.index;
  });

  item.images = filtered_images;
  await item.save();
  res.status(200).json({ message: 'Image removed.' });
});

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const item = await CatalogItem.findByIdAndRemove(req.params.id);
  if (!item) res.status(400).json({ message: 'Catalog Item with the given ID not found.' });

  res.status(200).json('Item Removed.');
});

module.exports = router;
