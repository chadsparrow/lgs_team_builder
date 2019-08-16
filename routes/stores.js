/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const express = require('express');
const moment = require('moment-timezone');
const swearjar = require('swearjar');
const { Store, validateStore, validateStoreItem } = require('../models/Store');
const { Team } = require('../models/Team');
const { Member } = require('../models/Member');
const { CatalogItem } = require('../models/CatalogItem');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

router.get('/', auth, async (req, res) => {
  const stores = await Store.find();
  if (stores && stores.length === 0) return res.status(404).send([{ message: 'No stores found.' }]);

  return res.send(stores);
});

router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send([{ message: 'Store with the given ID not found.' }]);

  return res.send(store);
});

router.get('/admin/:id', [validateObjectId, auth, admin], async (req, res) => {
  const stores = await Store.find({ adminId: req.params.id });
  if (stores && stores.length === 0)
    return res.status(400).send([{ message: 'Stores with the given admin ID not found.' }]);

  return res.send(stores);
});

router.get('/manager/:id', [validateObjectId, auth], async (req, res) => {
  const stores = await Store.find({ managerId: req.params.id });
  if (stores && stores.length === 0)
    return res.status(400).send([{ message: 'Stores with the given manager ID not found.' }]);

  return res.send(stores);
});

router.get('/team/:id', [validateObjectId, auth], async (req, res) => {
  const stores = await Store.find({ teamId: req.params.id });
  if (stores && stores.length === 0)
    return res.status(400).send([{ message: 'Stores with the given team ID not found.' }]);

  return res.send(stores);
});

router.get('/me', auth, async (req, res) => {
  const teams = await Team.find({ members: req.member._id });

  if (teams && teams.length === 0)
    return res.status(400).send([{ message: 'Member not registered to any team.' }]);

  const stores = teams.map(async team => {
    const store = await Store.find({ teamId: team._id });
    return store;
  });

  if (stores && stores.length === 0)
    return res.status(404).send([{ message: 'Team does not have any stores.' }]);

  return res.send(stores);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateStore(req.body);
  if (error) return res.status(400).send(error.details);

  const {
    teamId,
    storeName,
    brand,
    currency,
    orderReference,
    adminId,
    managerId,
    openingDate,
    closingDate,
    timezone,
    storeMessage,
    shipping
  } = req.body;

  let { mode } = req.body;

  if (swearjar.profane(storeName))
    return res.status(400).send([{ message: 'Store name must not contain profanity.' }]);
  if (swearjar.profane(storeMessage))
    return res.status(400).send([{ message: 'Store message must not contain profanity.' }]);

  if (!validateId(adminId)) return res.status(400).send([{ message: 'Invalid ID. (Admin)' }]);
  const storeAdmin = await Member.findById(adminId);
  if (!storeAdmin) return res.status(400).send([{ message: 'Admin with the given ID not found.' }]);

  if (!validateId(managerId)) return res.status(400).send([{ message: 'Invalid ID. (Manager)' }]);
  const manager = await Member.findById(managerId);
  if (!manager) return res.status(400).send([{ message: 'Manager with the given ID not found.' }]);

  const currentDate = moment.tz(timezone);

  if (
    currentDate.isAfter(moment.tz(openingDate, timezone)) &&
    currentDate.isBefore(moment.tz(closingDate, timezone))
  ) {
    mode = 'OPEN';
  } else if (currentDate.isBefore(moment.tz(openingDate, timezone))) {
    mode = 'SURVEY';
  } else if (currentDate.isAfter(moment.tz(closingDate, timezone))) {
    mode = 'CLOSED';
  }

  const store = new Store({
    teamId,
    storeName,
    brand,
    currency,
    orderReference,
    adminId,
    managerId,
    mode,
    openingDate: moment.tz(openingDate, timezone).format(),
    closingDate: moment.tz(closingDate, timezone).format(),
    timezone,
    storeMessage,
    shipping
  });

  await store.save();
  return res.send(store);
});

router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStore(req.body);
  if (error) return res.status(400).send(error.details);

  const {
    teamId,
    storeName,
    brand,
    currency,
    orderReference,
    adminId,
    managerId,
    openingDate,
    closingDate,
    timezone,
    storeMessage,
    shipping
  } = req.body;

  let { mode } = req.body;

  if (swearjar.profane(storeName))
    return res.status(400).send([{ message: 'Store name must not contain profanity.' }]);
  if (swearjar.profane(storeMessage))
    return res.status(400).send([{ message: 'Store message must not contain profanity.' }]);

  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send([{ message: 'Store with the given ID not found.' }]);

  if (!validateId(adminId)) return res.status(400).send([{ message: 'Invalid ID. (Admin)' }]);

  const storeAdmin = await Member.findById(adminId);
  if (!storeAdmin) return res.status(400).send([{ message: 'Admin with the given ID not found.' }]);

  if (!validateId(managerId)) return res.status(400).send([{ message: 'Invalid ID. (Manager)' }]);
  const manager = await Member.findById(managerId);
  if (!manager) return res.status(400).send([{ message: 'Manager with the given ID not found.' }]);

  const currentDate = moment.tz(timezone);

  if (
    currentDate.isAfter(moment.tz(openingDate, timezone)) &&
    currentDate.isBefore(moment.tz(closingDate, timezone))
  ) {
    mode = 'OPEN';
  } else if (currentDate.isBefore(moment.tz(openingDate, timezone))) {
    mode = 'SURVEY';
  } else if (currentDate.isAfter(moment.tz(closingDate, timezone))) {
    mode = 'CLOSED';
  }

  store.teamId = teamId;
  store.brand = brand;
  store.storeName = storeName;
  store.currency = currency;
  store.orderReference = orderReference;
  store.adminId = adminId;
  store.managerId = managerId;
  store.mode = mode;
  store.openingDate = moment.tz(openingDate, timezone).format();
  store.closingDate = moment.tz(closingDate, timezone).format();
  store.timezone = timezone;
  store.storeMessage = storeMessage;
  store.shipping = shipping;

  await store.save();
  return res.send(store);
});

router.patch('/add/item/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStoreItem(req.body);
  if (error) return res.status(400).send(error.details);

  const store = await Store.findById(req.params.id);
  if (!store) return res.status(400).send([{ message: 'Store with the given ID not found.' }]);

  const { itemId, sizesOffered, category, name, code, number, images } = req.body;

  if (!validateId(itemId)) return res.status(400).send([{ message: 'Invalid ID. (Item)' }]);
  const catalogItem = await CatalogItem.findById(itemId);
  if (!catalogItem)
    res.status(400).send([{ message: 'Catalog Item with the given ID not found.' }]);

  const newItem = {
    itemId,
    sizesOffered,
    category,
    name,
    code,
    number,
    images
  };

  store.items.push(newItem);

  await store.save();
  return res.send(store.items);
});

router.delete('/:id/item/:itemId', [validateObjectId, auth, admin], async (req, res) => {
  const store = await Store.findById(req.params.id);
  if (!store) res.status(400).send([{ message: 'Store with the given ID not found.' }]);

  if (!validateId(req.params.itemId))
    return res.status(400).send([{ message: 'Invalid ID. (Item)' }]);

  const filtered = store.items.filter(item => {
    return item.itemId !== req.params.itemId;
  });

  store.items = filtered;

  await store.save();
  return res.send(store.items);
});

module.exports = router;
