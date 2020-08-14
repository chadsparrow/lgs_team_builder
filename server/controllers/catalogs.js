const aqp = require('api-query-params');
const {
  Catalog,
  validateCatalog,
  validateCoverImage,
} = require('../models/Catalog');
const createError = require('http-errors');

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
          throw createError(400, 'Invalid year requested');
      }

      const catalogs = await Catalog.find(filter).sort({ year: -1, brand: 1 });
      if (catalogs && catalogs.length === 0)
        throw createError(404, 'No catalogs found');

      return res.send(catalogs);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Collects specific catalog based on ID
  // @route   GET /api/v1/catalogs/:id
  // @access  Private - admin
  getCatalog: async (req, res, next) => {
    try {
      const catalog = await Catalog.findById(req.params.id);
      if (!catalog)
        throw createError(400, 'Catalog with the given ID not found');

      return res.send(catalog);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Add new catalog
  // @route   POST /api/v1/catalogs/
  // @access  Private - admin
  addCatalog: async (req, res, next) => {
    try {
      const { error } = validateCatalog(req.body);
      if (error) throw createError(400, error, error.details);
      const { brand, season, year, coverImg } = req.body;

      // checks if catalog already exists and denies
      let catalog = await Catalog.findOne({
        brand: brand.toUpperCase(),
        season: season.toUpperCase(),
        year,
      });

      if (catalog) throw createError(400, 'Catalog already exists');

      catalog = new Catalog({
        brand,
        season,
        year,
        coverImg,
      });

      await catalog.save();

      return res.send(catalog);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Update a specific catalog based on ID
  // @route   PUT /api/v1/catalogs/:id
  // @access  Private - admin
  updateCatalog: async (req, res, next) => {
    try {
      const { error } = validateCatalog(req.body);
      if (error) throw createError(400, error, error.details);

      const { brand, season, year, coverImg } = req.body;

      const catalog = await Catalog.findById(req.params.id);
      if (!catalog)
        throw createError(400, 'Catalog with the given ID not found');

      // checks to see if updated catalog already matches an existing catalog in the database and denies
      const duplicateCatalog = await Catalog.findOne({
        brand: brand.toUpperCase(),
        season: season.toUpperCase(),
        year,
      });
      if (duplicateCatalog) throw createError(400, 'Catalog already exists');

      catalog.brand = brand;
      catalog.season = season;
      catalog.year = year;
      catalog.coverImg = coverImg;

      await catalog.save();
      return res.send(catalog);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Update catalog cover image
  // @route   PATCH /api/v1/catalogs/:id/coverImg
  // @access  Private - admin
  updateCatalogCover: async (req, res, next) => {
    try {
      const { error } = validateCoverImage(req.body);
      if (error) throw createError(400, error, error.details);

      const catalog = await Catalog.findByIdAndUpdate(
        req.params.id,
        { coverImg: req.body.coverImg },
        { new: true }
      );
      if (!catalog)
        throw createError(400, 'Catalog with the given ID not found');

      return res.json(catalog);
    } catch (err) {
      next(err);
    }
  },
};
