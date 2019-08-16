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
      return res.status(400).send([{ message: 'Invalid year requested.' }]);
  }

  const catalogs = await Catalog.find(filter);
  if (catalogs && catalogs.length === 0)
    return res.status(404).send([{ message: 'No catalogs found.' }]);

  return res.send(catalogs);
});

// Collects a specific catalog based on given ID
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const catalog = await Catalog.findById(req.params.id);
  if (!catalog) return res.status(400).send([{ message: 'Catalog with the given ID not found.' }]);

  return res.json(catalog);
});

// Adds a new catalog, doesn't allow duplicate brand/season/year
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateCatalog(req.body);
  if (error) return res.status(400).send(error.details);
  const { brand, season, year, coverImg } = req.body;

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

  return res.send(catalog);
});

// Edits a specific catalog, doesnt allow duplicate brand/season/year
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalog(req.body);
  if (error) return res.status(400).send(error.details);

  const { brand, season, year, coverImg } = req.body;

  const catalog = await Catalog.findById(req.params.id);
  if (!catalog) return res.status(400).send([{ message: 'Catalog with the given ID not found.' }]);

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

// edits the cover image URI of the catalog
router.patch('/coverImg/:id', [validateObjectId, auth, admin], async (req, res) => {
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
