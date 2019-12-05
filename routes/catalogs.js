const express = require('express');

const router = express.Router();
const aqp = require('api-query-params');
const { Catalog, validateCatalog, validateCoverImage } = require('../models/Catalog');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const mkdirp = require('mkdirp');

// @desc    Collects all catalogs
// @route   GET /api/v1/catalogs
// @access  Private - admin
router.get('/', [auth, admin], async (req, res) => {
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
});

// @desc    Collects specific catalog based on ID
// @route   GET /api/v1/catalogs/:id
// @access  Private - admin
router.get('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const catalog = await Catalog.findById(req.params.id);
  if (!catalog) return res.status(400).send([{ message: 'Catalog with the given ID not found.' }]);

  return res.send(catalog);
});

// @desc    Add new catalog
// @route   POST /api/v1/catalogs/
// @access  Private - admin
router.post('/', [auth, admin], async (req, res) => {
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

  mkdirp(`../static/images/catalogs/${catalog._id}`, err => {
    if (err) console.error(err);
    else console.log('pow!');
  });

  return res.send(catalog);
});

// @desc    Update a specific catalog based on ID
// @route   PUT /api/v1/catalogs/:id
// @access  Private - admin
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalog(req.body);
  if (error) return res.status(400).send(error.details);

  const { brand, season, year, coverImg } = req.body;

  const catalog = await Catalog.findById(req.params.id);
  if (!catalog) return res.status(400).send([{ message: 'Catalog with the given ID not found.' }]);

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
});

// @desc    Update catalog cover image
// @route   PATCH /api/v1/catalogs/:id/coverImg
// @access  Private - admin
router.patch('/:id/coverImg', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCoverImage(req.body);
  if (error) return res.status(400).send(error.details);

  const catalog = await Catalog.findByIdAndUpdate(
    req.params.id,
    { coverImg: req.body.coverImg },
    { new: true }
  );
  if (!catalog) return res.status(400).send([{ message: 'Catalog with the given ID not found.' }]);

  return res.json(catalog);
});

module.exports = router;
