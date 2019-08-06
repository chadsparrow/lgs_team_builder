const express = require('express');
const router = express.Router();
const { CatalogItem, validateCatalogItem, validateCatalogItemEdit, validateCatalogImg } = require('../models/CatalogItem');
const { Catalog } = require('../models/Catalog');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

const popOptions = { path: 'catalog_id', select: 'brand season year' };

// Collects all catalog items
router.get('/', auth, async (req, res) => {
  const items = await CatalogItem.find().populate(popOptions);
  if (items && items.length === 0) return res.status(404).send({ message: 'There are no catalog items.' });

  res.json(items);
});

// Collects all items from a specific catalog item based on given ID
router.get('/catalog/:id', [validateObjectId, auth], async (req, res) => {
  const items = await CatalogItem.find({ catalog_id: req.params.id });
  if (items && items.length === 0) return res.status(400).send({ message: 'Catalog with the given ID has no items.' });

  res.json(items);
});

// Collects an item based on a given ID
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const item = await CatalogItem.findById(req.params.id).populate(popOptions);
  if (!item) return res.status(400).send({ message: 'Catalog Item with the given ID not found.' });

  res.json(item);
});

// adds a new catalog item, doesnt allow duplicates
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateCatalogItem(req.body);
  if (error) return res.status(400).send(error.details);

  let { catalog_id, name, product_code, style_code, sizes, price, gender, description, category, images, isActive } = req.body;

  let item = await CatalogItem.findOne({ catalog_id: catalog_id, product_code: product_code.toUpperCase(), style_code: style_code.toUpperCase() });
  if (item) return res.status(400).send({ message: 'Product already exists.' });

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
    isActive
  });

  await item.save();
  res.json(await populateCatalogItem(item._id));
});

// Edits a certain item in a catalog, doesnt allow duplicates
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalogItemEdit(req.body);
  if (error) return res.status(400).send(error.details);

  let { name, product_code, style_code, sizes, price, gender, description, category, images, isActive } = req.body;

  let item = await CatalogItem.findById(req.params.id);
  if (!item) return res.status(400).send({ message: 'Item with the given ID not found.' });

  const dupItem = await CatalogItem.findOne({
    _id: { $ne: req.params.id },
    catalog_id: item.catalog_id,
    product_code: product_code.toUpperCase(),
    style_code: style_code.toUpperCase()
  });
  if (dupItem) return res.status(400).send({ message: 'Item already exists.' });

  item.name = name;
  item.product_code = product_code;
  item.style_code = style_code;
  item.sizes = sizes;
  item.price = price;
  item.gender = gender;
  item.description = description;
  item.category = category;
  item.images = images;
  item.isActive = isActive;

  await item.save();
  res.json(populateCatalogItem(item._id));
});

// adds an image URI to the items image array
router.patch('/img/add/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalogImg(req.body);
  if (error) return res.status(400).send(error.details);

  let item = await CatalogItem.findById(req.params.id);
  if (!item) return res.status(400).send({ message: 'Catalog Item with the given ID not found.' });

  item.images.push(req.body.image_url);
  await item.save();

  res.json(populateCatalogItem(item._id));
});

// edits an image URI in items image array
router.patch('/img/edit/:id/:index', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalogImg(req.body);
  if (error) return res.status(400).send(error.details);

  let item = await CatalogItem.findById(req.params.id);
  if (!item) return res.status(400).send({ message: 'Catalog Item with the given ID not found.' });

  item.images[req.params.index] = req.body.image_url;
  await item.save();

  res.json(populateCatalogItem(item._id));
});

router.delete('/img/delete/:id/:index', [validateObjectId, auth, admin], async (req, res) => {
  const item = await CatalogItem.findById(req.params.id);
  if (!item) return res.status(400).send({ message: 'Catalog Item with the given ID not found.' });
  const filteredImages = item.images.filter((image, index) => {
    return index != req.params.index;
  });

  item.images = filteredImages;
  await item.save();
  res.status(200).send({ message: 'Image removed.' });
});

router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const item = await CatalogItem.findByIdAndRemove(req.params.id);
  if (!item) res.status(400).send({ message: 'Catalog Item with the given ID not found.' });

  res.status(200).send('Item Removed.');
});

function populateCatalogItem(catalogItem) {
  return new Promise(async (resolve, reject) => {
    let popcatitem = await CatalogItem.findById(catalogItem).populate(popOptions);
    resolve(popcatitem);
  });
}

module.exports = router;
