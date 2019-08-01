const express = require('express');
const router = express.Router();
const { Catalog, validateCatalog, validateCoverImage } = require('../models/Catalog');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

// Collects all catalogs
router.get('/', auth, async (req, res) => {
  const catalogs = await Catalog.find();
  if (catalogs && catalogs.length === 0) return res.status(404).send({ msg: 'No catalogs found.' });

  res.send(catalogs);
});

// Collects all catalogs for a brand specified
router.get('/b', auth, async (req, res) => {
  if (!req.body.brand) return res.status(400).send({ msg: 'Invalid brand requested.' });
  const brand = req.body.brand.toUpperCase();

  const catalogs = await Catalog.find({ brand });
  if (catalogs && catalogs.length === 0) return res.status(404).send({ msg: 'No catalogs found.' });

  res.send(catalogs);
});

// Collects all catalogs for a season specified
router.get('/s', auth, async (req, res) => {
  if (!req.body.season) return res.status(400).send({ msg: 'Invalid season requested.' });
  const season = req.body.season.toUpperCase();
  const catalogs = await Catalog.find({ season });
  if (catalogs && catalogs.length === 0) return res.status(404).send({ msg: 'No catalogs found.' });

  res.send(catalogs);
});

// Collects all catalogs for a year specified
router.get('/y', auth, async (req, res) => {
  if (!req.body.year) return res.status(400).send({ msg: 'Valid year required.' });
  const year = req.body.year.toUpperCase();
  const pattern = new RegExp(/^\d{4}$/);
  if (!pattern.test(year)) return res.status(400).send({ msg: 'Invalid year requested.' });

  const catalogs = await Catalog.find({ year });
  if (catalogs && catalogs.length === 0) return res.status(404).send({ msg: 'No catalogs found.' });

  res.send(catalogs);
});

// Collects a specific catalog based on given ID
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const catalog = await Catalog.findById(req.params.id);
  if (!catalog) return res.status(400).send({ msg: 'Catalog with the given ID not found.' });
});

// Adds a new catalog, doesn't allow duplicate brand/season/year
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateCatalog(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });
  let { brand, season, year, cover_img } = req.body;

  let catalog = await Catalog.findOne({ brand: brand.toUpperCase(), season: season.toUpperCase(), year: year });

  if (catalog) return res.status(400).send({ msg: 'Catalog already exists.' });

  catalog = new Catalog({
    brand,
    season,
    year,
    cover_img
  });

  await catalog.save();

  res.send(catalog);
});

// Edits a specific catalog, doesnt allow duplicate brand/season/year
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCatalog(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let { brand, season, year, cover_img } = req.body;

  let catalog = await Catalog.findById(req.params.id);
  if (!catalog) return res.status(400).send({ msg: 'Catalog with the given ID not found.' });

  const dupcatalog = await Catalog.findOne({ brand: brand.toUpperCase(), season: season.toUpperCase(), year });
  if (dupcatalog) return res.status(400).send({ msg: 'Catalog already exists.' });

  catalog.brand = brand;
  catalog.season = season;
  catalog.year = year;
  catalog.cover_img = cover_img;

  await catalog.save();
  res.send(catalog);
});

// edits the cover image URI of the catalog
router.patch('/cover_img/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateCoverImage(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  const catalog = await Catalog.findByIdAndUpdate(req.params.id, { cover_img: req.body.cover_img }, { new: true });
  if (!catalog) return res.status(400).send({ msg: 'Catalog with the given ID not found.' });

  res.send(catalog);
});

module.exports = router;
