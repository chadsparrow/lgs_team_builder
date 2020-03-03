const logger = require('../middleware/logger');
const aqp = require('api-query-params');
const { Catalog, validateCatalog, validateCoverImage } = require('../models/Catalog');
const fs = require('fs');

module.exports = {
  // @desc    Collects all catalogs
  // @route   GET /api/v1/catalogs
  // @access  Private - admin
  getCatalogs: async (req, res, next) => {
    try {
      const { filter } = aqp(req.query);
      if (filter.year) {
        const pattern = new RegExp(/^\d{4}$/);
        if (!pattern.test(filter.year))
          return res.status(400).send([{ message: 'Invalid year requested.' }]);
      }

      const catalogs = await Catalog.find(filter).sort({ year: -1, brand: 1 });
      if (catalogs && catalogs.length === 0)
        return res.status(404).send([{ message: 'No catalogs found.' }]);

      return res.send(catalogs);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Collects specific catalog based on ID
  // @route   GET /api/v1/catalogs/:id
  // @access  Private - admin
  getCatalog: async (req, res, next) => {
    try {
      const catalog = await Catalog.findById(req.params.id);
      if (!catalog)
        return res.status(400).send([{ message: 'Catalog with the given ID not found.' }]);

      return res.send(catalog);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Add new catalog
  // @route   POST /api/v1/catalogs/
  // @access  Private - admin
  addCatalog: async (req, res, next) => {
    try {
      const { error } = validateCatalog(req.body);
      if (error) return res.status(400).send(error.details);
      const { brand, season, year, coverImg } = req.body;

      // checks if catalog already exists and denies
      let catalog = await Catalog.findOne({
        brand: brand.toUpperCase(),
        season: season.toUpperCase(),
        year
      });

      if (catalog) return res.status(400).send([{ message: 'Catalog already exists.' }]);

      catalog = new Catalog({
        brand,
        season,
        year,
        coverImg
      });

      await catalog.save();

      const dir1 = `static/images/catalogs/${catalog._id}`;
      const dir2 = `static/images/catalogs/${catalog._id}/300`;
      const dir3 = `static/images/catalogs/${catalog._id}/800`;
      try {
        fs.mkdirSync(dir1);
        fs.mkdirSync(dir2);
        fs.mkdirSync(dir3);
      } catch (err) {
        if (err.code === 'EEXIST') logger.error(err);
      }

      return res.send(catalog);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Update a specific catalog based on ID
  // @route   PUT /api/v1/catalogs/:id
  // @access  Private - admin
  updateCatalog: async (req, res, next) => {
    try {
      const { error } = validateCatalog(req.body);
      if (error) return res.status(400).send(error.details);

      const { brand, season, year, coverImg } = req.body;

      const catalog = await Catalog.findById(req.params.id);
      if (!catalog)
        return res.status(400).send([{ message: 'Catalog with the given ID not found.' }]);

      // checks to see if updated catalog already matches an existing catalog in the database and denies
      const duplicateCatalog = await Catalog.findOne({
        brand: brand.toUpperCase(),
        season: season.toUpperCase(),
        year
      });
      if (duplicateCatalog) return res.status(400).send([{ message: 'Catalog already exists.' }]);

      catalog.brand = brand;
      catalog.season = season;
      catalog.year = year;
      catalog.coverImg = coverImg;

      await catalog.save();
      return res.send(catalog);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Update catalog cover image
  // @route   PATCH /api/v1/catalogs/:id/coverImg
  // @access  Private - admin
  updateCatalogCover: async (req, res, next) => {
    try {
      const { error } = validateCoverImage(req.body);
      if (error) return res.status(400).send(error.details);

      const catalog = await Catalog.findByIdAndUpdate(
        req.params.id,
        { coverImg: req.body.coverImg },
        { new: true }
      );
      if (!catalog)
        return res.status(400).send([{ message: 'Catalog with the given ID not found.' }]);

      return res.json(catalog);
    } catch (err) {
      logger.error(err);
    }
  }
};