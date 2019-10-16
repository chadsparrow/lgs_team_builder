/* eslint-disable no-underscore-dangle */
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

const populateOptions = { path: 'catalogId', select: 'brand season year' };

function populateCatalogItem(catalogItem) {
  return new Promise(async resolve => {
    const populatedCatalogItem = await CatalogItem.findById(catalogItem).populate(populateOptions);
    resolve(populatedCatalogItem);
  });
}

// Collects all catalog items
router.get('/', auth, async (req, res) => {
  const items = await CatalogItem.find().populate(populateOptions);
  if (items && items.length === 0)
    return res.status(404).send([{ message: 'There are no catalog items.' }]);

  return res.json(items);
});

// Collects all items from a specific catalog item based on given ID
router.get('/catalog/:id', [validateObjectId, auth], async (req, res) => {
  const items = await CatalogItem.find({ catalogId: req.params.id });
  if (items && items.length === 0)
    return res.status(400).send([{ message: 'Catalog has no items.' }]);

  return res.send(items);
});

// Collects an item based on a given ID
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const item = await CatalogItem.findById(req.params.id).populate(populateOptions);
  if (!item)
    return res.status(400).send([{ message: 'Catalog Item with the given ID not found.' }]);

  return res.send(item);
});

// adds a new catalog item, doesnt allow duplicates
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateCatalogItem(req.body);
  if (error) return res.status(400).send(error.details);

  const {
    catalogId,
    nameEN,
    nameFR,
    productCode,
    styleCode,
    sizes,
    priceBreaks,
    gender,
    descriptionEN,
    descriptionFR,
    categories
  } = req.body;

  let item = await CatalogItem.findOne({
    $and: [
      { catalogId },
      { $or: [{ productCode: productCode.toUpperCase() }, { styleCode: styleCode.toUpperCase() }] }
    ]
  });

  if (item) return res.status(400).send([{ message: 'Product already exists.' }]);

  item = new CatalogItem({
    catalogId,
    nameEN,
    nameFR,
    productCode,
    styleCode,
    sizes,
    priceBreaks,
    gender,
    descriptionEN,
    descriptionFR,
    categories
  });

  await item.save();
  return res.status(200).send([{ message: 'Item added to Catalog' }]);
});

// Edits a certain item in a catalog, doesnt allow duplicates
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalogItemEdit(req.body);
  if (error) return res.status(400).send(error.details);

  const {
    nameEN,
    nameFR,
    productCode,
    styleCode,
    sizes,
    priceBreaks,
    gender,
    descriptionEN,
    descriptionFR,
    categories,
    images,
    isActive
  } = req.body;

  const item = await CatalogItem.findById(req.params.id);
  if (!item) return res.status(400).send([{ message: 'Item with the given ID not found.' }]);

  const duplicateItem = await CatalogItem.findOne({
    _id: { $ne: req.params.id },
    catalog_id: item.catalog_id,
    productCode: productCode.toUpperCase(),
    styleCode: styleCode.toUpperCase()
  });
  if (duplicateItem) return res.status(400).send([{ message: 'Item already exists.' }]);

  item.nameEN = nameEN;
  item.nameFR = nameFR;
  item.productCode = productCode;
  item.styleCode = styleCode;
  item.sizes = sizes;
  item.priceBreaks = priceBreaks;
  item.gender = gender;
  item.descriptionEN = descriptionEN;
  item.descriptionFR = descriptionFR;
  item.categories = categories;
  item.images = images;
  item.isActive = isActive;

  await item.save();
  return res.send(populateCatalogItem(item._id));
});

// adds an image URI to the items image array
router.patch('/img/add/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalogImg(req.body);
  if (error) return res.status(400).send(error.details);

  const item = await CatalogItem.findById(req.params.id);
  if (!item)
    return res.status(400).send([{ message: 'Catalog Item with the given ID not found.' }]);

  item.images.push(req.body.image_url);
  await item.save();

  return res.send(populateCatalogItem(item._id));
});

// edits an image URI in items image array
router.patch('/img/edit/:id/:index', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalogImg(req.body);
  if (error) return res.status(400).send(error.details);

  const item = await CatalogItem.findById(req.params.id);
  if (!item)
    return res.status(400).send([{ message: 'Catalog Item with the given ID not found.' }]);

  item.images[req.params.index] = req.body.image_url;
  await item.save();

  return res.send(populateCatalogItem(item._id));
});

router.delete('/img/delete/:id/:index', [validateObjectId, auth, admin], async (req, res) => {
  const item = await CatalogItem.findById(req.params.id);
  if (!item)
    return res.status(400).json([{ message: 'Catalog Item with the given ID not found.' }]);
  const filteredImages = item.images.filter((image, index) => {
    return index !== req.params.index;
  });

  item.images = filteredImages;
  await item.save();
  return res.status(200).send([{ message: 'Image removed.' }]);
});

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const item = await CatalogItem.findByIdAndRemove(req.params.id);
  if (!item) res.status(400).send([{ message: 'Catalog Item with the given ID not found.' }]);

  return res.status(200).send([{ message: 'Item Removed.' }]);
});

module.exports = router;
