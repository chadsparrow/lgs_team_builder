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

// this function populates all the catalogitem reference fields
function populateCatalogItem(catalogItem) {
  return new Promise(async resolve => {
    const populatedCatalogItem = await CatalogItem.findById(catalogItem).populate(populateOptions);
    resolve(populatedCatalogItem);
  });
}

// @desc    Gets all catalog items
// @route   GET /api/v1/catalogitems/
// @access  Private
router.get('/', auth, async (req, res) => {
  const items = await CatalogItem.find().populate(populateOptions);
  if (items && items.length === 0)
    return res.status(404).send([{ message: 'There are no catalog items.' }]);

  return res.json(items);
});

// @desc    Collects all items from a specific catalog
// @route   GET /api/v1/catalogitems/catalog/:id
// @access  Private
router.get('/catalog/:id', [validateObjectId, auth], async (req, res) => {
  const items = await CatalogItem.find({ catalogId: req.params.id });
  if (items && items.length === 0)
    return res.status(400).send([{ message: 'Catalog has no items.' }]);

  return res.send(items);
});

// @desc    Collects a specific catalog item
// @route   GET /api/v1/catalogitems/:id
// @access  Private
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const item = await CatalogItem.findById(req.params.id).populate(populateOptions);
  if (!item)
    return res.status(400).send([{ message: 'Catalog Item with the given ID not found.' }]);

  return res.send(item);
});

// @desc    Add a new catalog item
// @route   POST /api/v1/catalogitems/
// @access  Private - admin
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

  // Checks if catalog item with the same product code or stylecode in the current catalog exists and denies
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

// @desc    Update a catalog item
// @route   PUT /api/v1/catalogitems/:id
// @access  Private - admin
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

  // checks if item exists
  const item = await CatalogItem.findById(req.params.id);
  if (!item) return res.status(400).send([{ message: 'Item with the given ID not found.' }]);

  // checks if there already is an item with the same product code & style code and denies
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

// @desc    Adds an image file name to the item's image array
// @route   PATCH /api/v1/catalogitems/img/add/:id
// @access  Private - admin
router.patch('/img/add/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalogImg(req.body);
  if (error) return res.status(400).send(error.details);

  // checks if catalog item exists
  const item = await CatalogItem.findById(req.params.id);
  if (!item)
    return res.status(400).send([{ message: 'Catalog Item with the given ID not found.' }]);

  // pushes image_url data into images array
  item.images.push(req.body.image_url);
  await item.save();

  return res.send(populateCatalogItem(item._id));
});

// @desc    Update an image URI in item's image array
// @route   PATCH /api/v1/catalogitems/img/edit/:id/:index
// @access  Private - admin
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

// @desc    Delete an image URI from item's image array
// @route   DELETE /api/v1/catalogitems/img/delete/:id/:index
// @access  Private - admin
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

// @desc    Delete a catalog item from catalog
// @route   DELETE /api/v1/catalogitems/:id
// @access  Private - admin
router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const item = await CatalogItem.findByIdAndRemove(req.params.id);
  if (!item) res.status(400).send([{ message: 'Catalog Item with the given ID not found.' }]);

  return res.status(200).send([{ message: 'Item Removed.' }]);
});

module.exports = router;
