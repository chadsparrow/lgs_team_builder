/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const express = require('express');
const swearjar = require('swearjar');
const { Store, validateStore } = require('../models/Store');
const { Team } = require('../models/Team');
const { Member } = require('../models/Member');
const { StoreItem } = require('../models/StoreItem');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

function validateId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// @desc    Gets all stores
// @route   GET /api/v1/stores/
// @access  Private
router.get('/', auth, async (req, res) => {
  let stores = [];

  // Only gets all stores if current user is an admin
  if (req.member.isAdmin) {
    stores = await Store.find()
      .sort({ createdAt: -1 })
      .populate({ path: 'managerId', select: 'name email' })
      .populate({ path: 'adminId', select: 'name email' })
      .populate({ path: 'teamId', select: 'name teamId' })
      .select('-updatedAt -__v ');

    if (stores && stores.length === 0)
      return res.status(404).send([{ message: 'There are no stores.' }]);

    return res.send(stores);
  }

  // Only gets stores for current member - cycles through teams they are a part of and adds to response
  const teams = await Team.find({ members: req.member._id });
  if (teams && teams.length === 0)
    return res.status(400).send([{ message: 'You are currently not a member of any team' }]);

  teams.forEach(team => {
    stores = [...stores, ...team.stores];
  });

  // only sends stores that are NOT on HOLD
  stores = await Store.find({ _id: { $in: stores }, mode: { $ne: 'HOLD' } })
    .sort({ createdAt: -1 })
    .populate({ path: 'managerId', select: 'name email' })
    .populate({ path: 'adminId', select: 'name email' })
    .populate({ path: 'teamId', select: 'name teamId' })
    .select('-updatedAt -__v ');

  if (stores && stores.length === 0)
    return res.status(404).send([{ message: 'You have no open stores.' }]);

  return res.send(stores);
});

// @desc    Get a specific store
// @route   GET /api/v1/stores/:id
// @access  Private
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const store = await Store.findById(req.params.id)
    .sort({ createdAt: -1 })
    .populate({ path: 'managerId', select: 'name email phone' })
    .populate({ path: 'adminId', select: 'name email' })
    .populate({ path: 'teamId', select: 'name teamId mainContact bulkShipping' })
    .select('-updatedAt -__v ');
  if (!store) return res.status(400).send([{ message: 'Store with the given ID not found.' }]);

  return res.send(store);
});

// @desc    Get all stores for specific team
// @route   GET /api/v1/stores/team/:id
// @access  Private
router.get('/team/:id', [validateObjectId, auth], async (req, res) => {
  let stores = [];
  // shows all stores if user is admin
  if (req.member.isAdmin) {
    stores = await Store.find({ teamId: req.params.id })
      .sort({ createdAt: -1 })
      .populate({ path: 'managerId', select: 'name email' })
      .populate({ path: 'adminId', select: 'name email' })
      .populate({ path: 'teamId', select: 'name teamId' })
      .select('-updatedAt -__v ');
    if (stores && stores.length === 0)
      return res.status(404).send([{ message: 'Team has no stores.' }]);

    return res.send(stores);
  }

  // shows all stores NOT on hold for anyone else
  stores = await Store.find({ teamId: req.params.id, mode: { $ne: 'HOLD' } }).sort({
    createdAt: -1
  });
  if (stores && stores.length === 0)
    return res.status(404).send([{ message: 'Team has no open stores.' }]);

  return res.send(stores);
});

// @desc    Add a new store
// @route   POST /api/v1/stores/
// @access  Private - admin
router.post('/', [auth, admin], async (req, res) => {
  // checks store name for profanity and denies
  if (req.body.storeName) {
    if (swearjar.profane(req.body.storeName))
      return res
        .status(400)
        .send([
          { message: 'Store name must not contain profanity', context: { key: 'storeName' } }
        ]);
  }

  // checks store message for profanity and denies
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
    brand,
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

  // checks if store already exists with the current name - denies duplicates
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

  // checks if store has a valid manager
  if (!validateId(managerId))
    return res
      .status(400)
      .send([{ message: 'Invalid ID. (Manager)', context: { key: 'managerId' } }]);

  const manager = await Member.findById(managerId);

  if (!manager)
    return res
      .status(400)
      .send([{ message: 'Manager with the given ID not found', context: { key: 'managerId' } }]);

  const team = await Team.findById(teamId);
  if (!team)
    return res
      .status(400)
      .send([{ message: 'Team with the given ID not found', context: { key: 'teamId' } }]);

  store = new Store({
    teamId,
    storeName,
    storeCountry,
    currency,
    brand,
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

  // copies team bulkshipping info over to store bulkshipping
  store.bulkShipping = team.bulkShipping;

  await store.save();

  await Team.updateOne({ _id: teamId }, { $push: { stores: store._id } });
  return res.status(201).send([{ message: 'Team Store Added' }]);
});

// @desc    Duplicates a current store - resets amounts needed - duplicates store items as well
// @route   POST /api/v1/stores/:id/dup
// @access  Private - admin
router.post('/:id/dup', [validateObjectId, auth, admin], async (req, res) => {
  const store = await Store.findById(req.params.id);
  const newStoreName = store.storeName.split(' ');
  let newStoreID = store._id.toString();
  newStoreID = newStoreID.substring(0, 7);

  const newStore = new Store({
    totalOrders: 0,
    totalItemsOrdered: 0,
    ordersTotalValue: 0,
    teamId: store.teamId,
    storeName: `${newStoreName[0]} ${newStoreID} COPY`,
    storeCountry: store.storeCountry,
    currency: store.currency,
    brand: store.brand,
    orderReference: store.orderReference,
    adminId: store.adminId,
    managerId: store.managerId,
    mode: 'HOLD',
    opendingDate: null,
    closingDate: null,
    timezone: store.timezone,
    storeMessage: `Copy of Store ${newStoreName[0]}`,
    shippingType: store.shippingType,
    extraCharges: store.extraCharges,
    collectedShippingCharges: [],
    bulkShipping: store.bulkShipping
  });

  await newStore.save();

  await Team.updateOne({ _id: newStore.teamId }, { $push: { stores: newStore._id } });

  const storeItems = await StoreItem.find({ storeId: store._id });
  if (storeItems.length > 0) {
    storeItems.forEach(async storeItem => {
      const {
        storeId,
        itemId,
        brand,
        isActive,
        sizesOffered,
        category,
        name,
        code,
        number,
        images,
        mandatoryItem,
        price,
        priceBreakGoal
      } = storeItem;

      await StoreItem.create({
        storeId,
        itemId,
        brand,
        surveyLikedBy: [],
        isActive,
        sizesOffered,
        category,
        name,
        code,
        number,
        images,
        mandatoryItem,
        price,
        priceBreakGoal
      });
    });
  }
  return res.status(200).send([{ message: 'Team Store duplicated', store: newStore }]);
});

// @desc    Update a store
// @route   PUT /api/v1/stores/:id
// @access  Private - admin
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateStore(req.body);
  if (error) return res.status(400).send(error.details);

  const {
    teamId,
    storeName,
    storeCountry,
    mode,
    brand,
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

  const team = await Team.findById(teamId);
  if (!team) return res.status(400).send([{ message: 'Team with the given ID not found' }]);

  store.teamId = teamId;
  store.storeName = storeName;
  store.brand = brand;
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

  // updates stores bulkshipping with current team bulkshipping info
  if (store.mode !== 'CLOSED') {
    store.bulkShipping = team.bulkShipping;
  }

  await store.save();
  return res.send([{ message: 'Store updated' }]);
});

module.exports = router;
