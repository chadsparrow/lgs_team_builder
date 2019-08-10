/* eslint-disable camelcase */
/* eslint-disable consistent-return */
const express = require('express');

const router = express.Router();
const aqp = require('api-query-params');
const { Catalog, validateCatalog, validateCoverImage } = require('../models/Catalog');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

// Collects all catalogs
router.get('/', auth, async (req, res) => {
  const { filter } = aqp(req.query);
  if (filter.year) {
    const pattern = new RegExp(/^\d{4}$/);
    if (!pattern.test(filter.year))
      return res.status(400).json({ message: 'Invalid year requested.' });
  }

  const catalogs = await Catalog.find(filter);
  if (catalogs && catalogs.length === 0)
    return res.status(404).json({ message: 'No catalogs found.' });

  res.json(catalogs);
});

// Collects a specific catalog based on given ID
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const catalog = await Catalog.findById(req.params.id);
  if (!catalog) return res.status(400).json({ message: 'Catalog with the given ID not found.' });

  res.json(catalog);
});

// Adds a new catalog, doesn't allow duplicate brand/season/year
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateCatalog(req.body);
  if (error) return res.status(400).json(error.details);
  const { brand, season, year, cover_img } = req.body;

  let catalog = await Catalog.findOne({
    brand: brand.toUpperCase(),
    season: season.toUpperCase(),
    year
  });

  if (catalog) return res.status(400).json({ message: 'Catalog already exists.' });

  catalog = new Catalog({
    brand,
    season,
    year,
    cover_img
  });

  await catalog.save();

  res.json(catalog);
});

// Edits a specific catalog, doesnt allow duplicate brand/season/year
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalog(req.body);
  if (error) return res.status(400).json(error.details);

  const { brand, season, year, cover_img } = req.body;

  const catalog = await Catalog.findById(req.params.id);
  if (!catalog) return res.status(400).json({ message: 'Catalog with the given ID not found.' });

  const duplicate_catalog = await Catalog.findOne({
    brand: brand.toUpperCase(),
    season: season.toUpperCase(),
    year
  });
  if (duplicate_catalog) return res.status(400).json({ message: 'Catalog already exists.' });

  catalog.brand = brand;
  catalog.season = season;
  catalog.year = year;
  catalog.cover_img = cover_img;

  await catalog.save();
  res.json(catalog);
});

// edits the cover image URI of the catalog
router.patch('/cover_img/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCoverImage(req.body);
  if (error) return res.status(400).json(error.details);

  const catalog = await Catalog.findByIdAndUpdate(
    req.params.id,
    { cover_img: req.body.cover_img },
    { new: true }
  );
  if (!catalog) return res.status(400).json({ message: 'Catalog with the given ID not found.' });

  res.json(catalog);
});

module.exports = router;
