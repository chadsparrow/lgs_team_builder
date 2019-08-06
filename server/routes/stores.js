const { Store, validateStore, validateStoreItem } = require('../models/Store');
const { Team } = require('../models/Team');
const { Member } = require('../models/Member');
const { CatalogItem } = require('../models/CatalogItem');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const moment = require('moment-timezone');
const swearjar = require('swearjar');

router.get('/', auth, async (req, res) => {
  const stores = await Store.find();
  if (stores && stores.length === 0) return res.status(404).send({ message: 'No stores found.' });

  res.json(stores);
});

router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send({ message: 'Store with the given ID not found.' });

  res.json(store);
});

router.get('/admin/:id', [validateObjectId, auth, admin], async (req, res) => {
  const stores = await Store.find({ admin_id: req.params.id });
  if (stores && stores.length === 0) return res.status(400).send({ message: 'Stores with the given admin ID not found.' });

  res.json(stores);
});

router.get('/manager/:id', [validateObjectId, auth], async (req, res) => {
  const stores = await Store.find({ manager_id: req.params.id });
  if (stores && stores.length === 0) return res.status(400).send({ message: 'Stores with the given manager ID not found.' });

  res.json(stores);
});

router.get('/team/:id', [validateObjectId, auth], async (req, res) => {
  const stores = await Store.find({ team_id: req.params.id });
  if (stores && stores.length === 0) return res.status(400).send({ message: 'Stores with the given team ID not found.' });

  res.json(stores);
});

router.get('/me', auth, async (req, res) => {
  const teams = await Team.find({ members: req.member._id });
  let memberstores = [];

  if (teams && teams.length === 0) return res.status(400).send({ message: 'Member not registered to any team.' });

  const stores = teams.map(async team => {
    return await Store.find({ team_id: team._id });
  });

  if (stores && stores.length === 0) return res.status(404).send({ message: 'Team does not have any stores.' });

  res.json(stores);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateStore(req.body);
  if (error) return res.status(400).send(error.details);

  let {
    team_id,
    store_name,
    brand,
    currency,
    order_reference,
    admin_id,
    manager_id,
    mode,
    opening_date,
    closing_date,
    timezone,
    store_message,
    shipping
  } = req.body;
  if (swearjar.profane(store_name)) return res.status(400).send({ message: 'Store name must not contain profanity.' });
  if (swearjar.profane(store_message)) return res.status(400).send({ message: 'Store message must not contain profanity.' });

  if (!validateId(admin_id)) return res.status(400).send({ message: 'Invalid ID. (Admin)' });
  const admin = await Member.findById(admin_id);
  if (!admin) return res.status(400).send({ message: 'Admin with the given ID not found.' });

  if (!validateId(manager_id)) return res.status(400).send({ message: 'Invalid ID. (Manager)' });
  const manager = await Member.findById(manager_id);
  if (!manager) return res.status(400).send({ message: 'Manager with the given ID not found.' });

  const currentDate = moment.tz(timezone);

  if (currentDate.isAfter(moment.tz(opening_date, timezone)) && currentDate.isBefore(moment.tz(closing_date, timezone))) {
    mode = 'OPEN';
  } else if (currentDate.isBefore(moment.tz(opening_date, timezone))) {
    mode = 'SURVEY';
  } else if (currentDate.isAfter(moment.tz(closing_date, timezone))) {
    mode = 'CLOSED';
  }

  const store = new Store({
    team_id,
    store_name,
    brand,
    currency,
    order_reference,
    admin_id,
    manager_id,
    mode,
    opening_date: moment.tz(opening_date, timezone).format(),
    closing_date: moment.tz(closing_date, timezone).format(),
    timezone,
    store_message,
    shipping
  });

  await store.save();
  res.json(store);
});

router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStore(req.body);
  if (error) return res.status(400).send(error.details);

  let {
    team_id,
    store_name,
    brand,
    currency,
    order_reference,
    admin_id,
    manager_id,
    mode,
    opening_date,
    closing_date,
    timezone,
    store_message,
    shipping
  } = req.body;
  if (swearjar.profane(store_name)) return res.status(400).send({ message: 'Store name must not contain profanity.' });
  if (swearjar.profane(store_message)) return res.status(400).send({ message: 'Store message must not contain profanity.' });

  let store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send({ message: 'Store with the given ID not found.' });

  if (!validateId(admin_id)) return res.status(400).send({ message: 'Invalid ID. (Admin)' });
  const admin = await Member.findById(admin_id);
  if (!admin) return res.status(400).send({ message: 'Admin with the given ID not found.' });

  if (!validateId(manager_id)) return res.status(400).send({ message: 'Invalid ID. (Manager)' });
  const manager = await Member.findById(manager_id);
  if (!manager) return res.status(400).send({ message: 'Manager with the given ID not found.' });

  const currentDate = moment.tz(timezone);

  if (currentDate.isAfter(moment.tz(opening_date, timezone)) && currentDate.isBefore(moment.tz(closing_date, timezone))) {
    mode = 'OPEN';
  } else if (currentDate.isBefore(moment.tz(opening_date, timezone))) {
    mode = 'SURVEY';
  } else if (currentDate.isAfter(moment.tz(closing_date, timezone))) {
    mode = 'CLOSED';
  }

  store.team_id = team_id;
  store.store_name = store_name;
  store.currency = currency;
  store.order_reference = order_reference;
  store.admin_id = admin_id;
  store.manager_id = manager_id;
  store.mode = mode;
  store.opening_date = moment.tz(opening_date, timezone).format();
  store.closing_date = moment.tz(closing_date, timezone).format();
  store.timezone = timezone;
  store.store_message = store_message;
  store.shipping = shipping;

  await store.save();
  res.json(store);
});

router.patch('/add/item/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStoreItem(req.body);
  if (error) return res.status(400).send(error.details);

  let store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send({ message: 'Store with the given ID not found.' });

  let { item_id, sizes_offered, category, name, code, number, images } = req.body;

  if (!validateId(item_id)) return res.status(400).send({ message: 'Invalid ID. (Item)' });
  const catalogItem = await CatalogItem.findById(item_id);
  if (!catalogItem) res.status(400).send({ message: 'Catalog Item with the given ID not found.' });

  const newItem = {
    item_id,
    sizes_offered,
    category,
    name,
    code,
    number,
    images
  };

  store.items.push(newItem);

  await store.save();
  res.json(store.items);
});

router.delete('/:id/item/:itemId', [validateObjectId, auth, admin], async (req, res) => {
  let store = await Store.findById(req.params.id);
  if (!store) res.status(400).send({ message: 'Store with the given ID not found.' });

  if (!validateId(req.params.itemId)) return res.status(400).send({ message: 'Invalid ID. (Item)' });
  let filtered = store.items.filter(item => {
    return item.item_id !== req.params.itemId;
  });

  store.items = filtered;

  await store.save();
  res.json(store.items);
});

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

module.exports = router;
