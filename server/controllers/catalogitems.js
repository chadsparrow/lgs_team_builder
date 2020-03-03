const logger = require('../middleware/logger');
const { CatalogItem, validateCatalogItem, validateCatalogImg } = require('../models/CatalogItem');
const populateOptions = { path: 'catalogId', select: 'brand season year' };

// this function populates all the catalogitem reference fields
function populateCatalogItem(catalogItem) {
  return new Promise(async resolve => {
    const populatedCatalogItem = await CatalogItem.findById(catalogItem).populate(populateOptions);
    resolve(populatedCatalogItem);
  });
}

module.exports = {
  // @desc    Gets all catalog items
  // @route   GET /api/v1/catalogitems/
  // @access  Private
  getCatalogItems: async (req, res, next) => {
    try {
      const items = await CatalogItem.find().populate({
        path: 'catalogId',
        select: 'brand season year'
      });
      if (items && items.length === 0)
        return res.status(404).send([{ message: 'There are no catalog items.' }]);

      return res.json(items);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Collects all items from a specific catalog
  // @route   GET /api/v1/catalogitems/catalog/:id
  // @access  Private
  getItemsForCatalog: async (req, res, next) => {
    try {
      const items = await CatalogItem.find({ catalogId: req.params.id });
      if (items && items.length === 0)
        return res.status(400).send([{ message: 'Catalog has no items.' }]);

      return res.send(items);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Collects a specific catalog item
  // @route   GET /api/v1/catalogitems/:id
  // @access  Private
  getCatalogItem: async (req, res, next) => {
    try {
      const item = await CatalogItem.findById(req.params.id).populate(populateOptions);
      if (!item)
        return res.status(400).send([{ message: 'Catalog Item with the given ID not found.' }]);

      return res.send(item);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Add a new catalog item
  // @route   POST /api/v1/catalogitems/
  // @access  Private - admin
  addCatalogItem: async (req, res, next) => {
    try {
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
          {
            $or: [
              { productCode: productCode.toUpperCase() },
              { styleCode: styleCode.toUpperCase() }
            ]
          }
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
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Update a catalog item
  // @route   PUT /api/v1/catalogitems/:id
  // @access  Private - admin
  updateCatalogItem: async (req, res, next) => {
    try {
      const { productCode, styleCode } = req.body;

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
      if (duplicateItem) return res.status(400).send([{ message: 'Product already exists.' }]);

      const updatedCatalogItem = await CatalogItem.updateOne({ _id: req.params.id }, req.body, {
        new: true
      });

      return res
        .status(200)
        .send([
          { message: 'Catalog item updated' },
          { updatedItem: populateCatalogItem(updatedCatalogItem._id) }
        ]);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Adds an image file name to the item's image array
  // @route   PATCH /api/v1/catalogitems/img/add/:id
  // @access  Private - admin
  addCatalogItemImage: async (req, res, next) => {
    try {
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
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Update an image URI in item's image array
  // @route   PATCH /api/v1/catalogitems/img/edit/:id/:index
  // @access  Private - admin
  updateCatalogItemImage: async (req, res, next) => {
    try {
      const { error } = validateCatalogImg(req.body);
      if (error) return res.status(400).send(error.details);

      const item = await CatalogItem.findById(req.params.id);
      if (!item)
        return res.status(400).send([{ message: 'Catalog Item with the given ID not found.' }]);

      item.images[req.params.index] = req.body.image_url;
      await item.save();

      return res.send(populateCatalogItem(item._id));
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Delete an image URI from item's image array
  // @route   DELETE /api/v1/catalogitems/img/delete/:id/:index
  // @access  Private - admin
  deleteCatalogItemImage: async (req, res, next) => {
    try {
      const item = await CatalogItem.findById(req.params.id);
      if (!item)
        return res.status(400).json([{ message: 'Catalog Item with the given ID not found.' }]);
      const filteredImages = item.images.filter((image, index) => {
        return index !== req.params.index;
      });

      item.images = filteredImages;
      await item.save();
      return res.status(200).send([{ message: 'Image removed.' }]);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Delete a catalog item from catalog
  // @route   DELETE /api/v1/catalogitems/:id
  // @access  Private - admin
  deleteCatalogItem: async (req, res, next) => {
    try {
      const item = await CatalogItem.findByIdAndRemove(req.params.id);
      if (!item) res.status(400).send([{ message: 'Catalog Item with the given ID not found.' }]);

      return res.status(200).send([{ message: 'Item Removed.' }]);
    } catch (err) {
      logger.error(err);
    }
  }
};
