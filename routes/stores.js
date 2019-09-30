/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const express = require('express');
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
  let stores = [];
  if (req.member.isAdmin) {
    stores = await Store.find()
      .populate({ path: 'managerId', select: 'name email' })
      .populate({ path: 'adminId', select: 'name email' })
      .populate({ path: 'teamId', select: 'name' })
      .select('-updatedAt -__v ');

    if (stores && stores.length === 0)
      return res.status(404).send([{ message: 'There are no stores.' }]);

    return res.send(stores);
  }

  const teams = await Team.find({ members: req.member._id });
  if (teams && teams.length === 0)
    return res.status(400).send([{ message: 'You are currently not a member of any team' }]);

  teams.forEach(team => {
    stores = [...stores, ...team.stores];
  });

  stores = await Store.find({ _id: { $in: stores } })
    .populate({ path: 'managerId', select: 'name email' })
    .populate({ path: 'adminId', select: 'name email' })
    .populate({ path: 'teamId', select: 'name' })
    .select('-updatedAt -__v ');

  if (stores && stores.length === 0)
    return res.status(404).send([{ message: 'You have no stores' }]);

  return res.send(stores);
});

router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const store = await Store.findById(req.params.id)
    .populate({ path: 'managerId', select: 'name email' })
    .populate({ path: 'adminId', select: 'name email' })
    .populate({ path: 'teamId', select: 'name' })
    .select('-updatedAt -__v ');
  if (!store) return res.status(400).send([{ message: 'Store with the given ID not found.' }]);

  return res.send(store);
});

router.get('/team/:id', [validateObjectId, auth], async (req, res) => {
  const stores = await Store.find({ teamId: req.params.id })
    .populate({ path: 'managerId', select: 'name email' })
    .populate({ path: 'adminId', select: 'name email' })
    .populate({ path: 'teamId', select: 'name' })
    .select('-updatedAt -__v ');
  if (stores && stores.length === 0)
    return res.status(404).send([{ message: 'Team has no stores.' }]);

  return res.send(stores);
});

router.post('/', [auth, admin], async (req, res) => {
  if (req.body.storeName) {
    if (swearjar.profane(req.body.storeName))
      return res
        .status(400)
        .send([
          { message: 'Store name must not contain profanity', context: { key: 'storeName' } }
        ]);
  }

  if (req.body.storeMessage) {
    if (swearjar.profane(req.body.storeMessage))
      return res
        .status(400)
        .send([
          { message: 'Store message must not contain profanity', context: { key: 'storeMessage' } }
        ]);
  }

  const { error } = validateStore(req.body);
  if (error) return res.status(400).send(error.details);

  const {
    teamId,
    storeName,
    storeCountry,
    currency,
    mode,
    orderReference,
    adminId,
    managerId,
    openingDate,
    closingDate,
    timezone,
    storeMessage,
    shippingType
  } = req.body;

  let store = await Store.findOne({ storeName });
  if (store)
    return res
      .status(400)
      .send([
        { message: 'Store with that name already registered', context: { key: 'storeName' } }
      ]);

  if (!validateId(adminId))
    return res.status(400).send([{ message: 'Invalid ID. (Admin)', context: { key: 'adminId' } }]);

  const storeAdmin = await Member.findById(adminId);

  if (!storeAdmin)
    return res
      .status(400)
      .send([{ message: 'Admin with the given ID not found', context: { key: 'adminId' } }]);

  if (!validateId(managerId))
    return res
      .status(400)
      .send([{ message: 'Invalid ID. (Manager)', context: { key: 'managerId' } }]);

  const manager = await Member.findById(managerId);

  if (!manager)
    return res
      .status(400)
      .send([{ message: 'Manager with the given ID not found', context: { key: 'managerId' } }]);

  store = new Store({
    teamId,
    storeName,
    storeCountry,
    currency,
    orderReference,
    adminId,
    managerId,
    mode,
    openingDate,
    closingDate,
    timezone,
    storeMessage,
    shippingType
  });

  await store.save();

  await Team.updateOne({ _id: teamId }, { $push: { stores: store._id } });
  return res.status(201).send([{ message: 'Team Store Added' }]);
});

router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStore(req.body);
  if (error) return res.status(400).send(error.details);

  const {
    teamId,
    storeName,
    storeCountry,
    mode,
    currency,
    orderReference,
    adminId,
    managerId,
    openingDate,
    closingDate,
    timezone,
    storeMessage,
    shippingType
  } = req.body;

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

  store.teamId = teamId;
  store.storeName = storeName;
  store.storeCountry = storeCountry;
  store.currency = currency;
  store.orderReference = orderReference;
  store.adminId = adminId;
  store.managerId = managerId;
  store.mode = mode;
  store.openingDate = openingDate;
  store.closingDate = closingDate;
  store.timezone = timezone;
  store.storeMessage = storeMessage;
  store.shippingType = shippingType;

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
