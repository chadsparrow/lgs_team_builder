const mongoose = require('mongoose');
const swearjar = require('swearjar');
const logger = require('../middleware/logger');
const { Store, validateStore } = require('../models/Store');
const { Team } = require('../models/Team');
const { Member } = require('../models/Member');

// @desc    Gets all stores
// @route   GET /api/v1/stores/
// @access  Private
exports.getStores = async (req, res, next) => {
  try {
    let stores = [];

    // Only gets all stores if current user is an admin
    if (req.member.isAdmin) {
      stores = await Store.find()
        .sort({ createdAt: -1 })
        .populate({ path: 'managerId', select: 'name email' })
        .populate({ path: 'adminId', select: 'name email' })
        .populate({ path: 'teamId', select: 'name teamId' })
        .select('-updatedAt -__v -items');

      if (stores && stores.length === 0)
        return res.status(404).send([{ message: 'There are no stores.' }]);

      return res.send(stores);
    }

    // Only gets stores for current member - cycles through teams they are a part of and adds to response
    const teams = await Team.find({ members: req.member._id });
    if (teams && teams.length === 0)
      return res.status(400).send([{ message: 'You are currently not a member of any team' }]);

    teams.forEach(team => {
      stores.push(team.stores);
    });

    // only sends stores that are NOT on HOLD
    const collectedStores = await Store.find({ _id: { $in: stores }, mode: { $ne: 'HOLD' } })
      .sort({ createdAt: -1 })
      .populate({ path: 'managerId', select: 'name email' })
      .populate({ path: 'adminId', select: 'name email' })
      .populate({ path: 'teamId', select: 'name teamId' })
      .select('-updatedAt -__v -items');

    if (collectedStores && collectedStores.length === 0)
      return res.status(404).send([{ message: 'You have no open stores.' }]);

    return res.send(collectedStores);
  } catch (err) {
    logger.error(err);
  }
};

// @desc    Get a specific store
// @route   GET /api/v1/stores/:id
// @access  Private
exports.getStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id)
      .sort({ createdAt: -1 })
      .populate({ path: 'managerId', select: 'name email phone' })
      .populate({ path: 'adminId', select: 'name email' })
      .populate({ path: 'teamId', select: 'name teamId mainContact bulkShipping' })
      .select('-updatedAt -__v -items');
    if (!store) return res.status(400).send([{ message: 'Store with the given ID not found.' }]);

    return res.send(store);
  } catch (err) {
    logger.error(err);
  }
};

// @desc    Get all stores for specific team
// @route   GET /api/v1/stores/team/:id
// @access  Private
exports.getTeamStores = async (req, res, next) => {
  try {
    let stores = [];
    // shows all stores if user is admin
    if (req.member.isAdmin) {
      stores = await Store.find({ teamId: req.params.id })
        .sort({ createdAt: -1 })
        .populate({ path: 'managerId', select: 'name email' })
        .populate({ path: 'adminId', select: 'name email' })
        .populate({ path: 'teamId', select: 'name teamId' })
        .select('-updatedAt -__v -items');
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
  } catch (err) {
    logger.error(err);
  }
};

// @desc    Add a new store
// @route   POST /api/v1/stores/
// @access  Private - admin
exports.addStore = async (req, res, next) => {
  try {
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
        return res.status(400).send([
          {
            message: 'Store message must not contain profanity',
            context: { key: 'storeMessage' }
          }
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
      refOrder,
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
      return res
        .status(400)
        .send([{ message: 'Invalid ID. (Admin)', context: { key: 'adminId' } }]);

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
      refOrder,
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
  } catch (err) {
    logger.error(err);
  }
};

// @desc    Duplicates a current store - resets amounts needed - duplicates store items as well
// @route   POST /api/v1/stores/:id/dup
// @access  Private - admin
exports.duplicateStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);
    const newStoreName = store.storeName.split(' ');
    let newStoreID = store._id.toString();
    newStoreID = newStoreID.substring(0, 7);

    const dupStoreItems = store.items.map(el => {
      return {
        itemId: el.itemId,
        catalogId: el.catalogId,
        surveyLikedBy: [],
        isActive: el.isActive,
        sizes: el.sizes,
        gender: el.gender,
        categories: el.categories,
        nameEN: el.nameEN,
        nameFR: el.nameFR,
        descriptionEN: el.descriptionEN,
        descriptionFR: el.descriptionFR,
        productCode: el.productCode,
        styleCode: el.styleCode,
        refNumber: el.refNumber,
        images: el.images,
        mandatoryItem: el.mandatoryItem,
        price: el.price,
        netPrice: el.netPrice,
        priceBreakGoal: el.priceBreakGoal,
        priceBreaks: el.priceBreaks,
        upChargeType: el.upChargeType,
        upChargeAmount: el.upChargeAmount,
        upChargeTotal: el.upChargeTotal
      };
    });

    const newStore = new Store({
      totalOrders: 0,
      totalItemsOrdered: 0,
      ordersTotalValue: 0,
      teamId: store.teamId,
      storeName: `${newStoreName[0]} ${newStoreID} COPY`,
      storeCountry: store.storeCountry,
      currency: store.currency,
      brand: store.brand,
      refOrder: store.refOrder,
      adminId: store.adminId,
      managerId: store.managerId,
      mode: 'HOLD',
      openingDate: null,
      closingDate: null,
      timezone: store.timezone,
      storeMessage: `Copy of Store ${newStoreName[0]}`,
      shippingType: store.shippingType,
      extraCharges: store.extraCharges,
      collectedShippingCharges: [],
      bulkShipping: store.bulkShipping,
      items: dupStoreItems
    });

    await newStore.save();

    await Team.updateOne({ _id: newStore.teamId }, { $push: { stores: newStore._id } });

    return res.status(200).send([{ message: 'Team Store duplicated', store: newStore }]);
  } catch (err) {
    logger.error(err);
  }
};

// @desc    Update a store
// @route   PUT /api/v1/stores/:id
// @access  Private - admin
exports.updateStore = async (req, res, next) => {
  try {
    const { error } = validateStore(req.body);
    if (error) return res.status(400).send(error.details);

    const {
      teamId,
      storeName,
      storeCountry,
      mode,
      brand,
      currency,
      refOrder,
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
    if (!storeAdmin)
      return res.status(400).send([{ message: 'Admin with the given ID not found.' }]);

    if (!validateId(managerId)) return res.status(400).send([{ message: 'Invalid ID. (Manager)' }]);
    const manager = await Member.findById(managerId);
    if (!manager)
      return res.status(400).send([{ message: 'Manager with the given ID not found.' }]);

    const team = await Team.findById(teamId);
    if (!team) return res.status(400).send([{ message: 'Team with the given ID not found' }]);

    store.teamId = teamId;
    store.storeName = storeName;
    store.brand = brand;
    store.storeCountry = storeCountry;
    store.currency = currency;
    store.refOrder = refOrder;
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
  } catch (err) {
    logger.error(err);
  }
};

// @desc    gets items in specific store
// @route   GET /api/v1/stores/:id/items
// @access  Private - admin
exports.getStoreItems = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id).select('items');
    if (!store) return res.status(400).send([{ message: 'Store with the given ID not found' }]);

    const { items } = store;
    return res.status(200).send(items);
  } catch (err) {
    logger.error(err);
  }
};

// @desc    update items in specific store
// @route   PUT /api/v1/stores/:id/items
// @access  Private - admin
exports.updateStoreItems = async (req, res, next) => {
  try {
    const { items } = req.body;

    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { items },
      { $upsert: true, new: true }
    ).select('items');

    return res.status(200).send([{ message: 'Items Updated', items: store.items }]);
  } catch (err) {
    logger.error(err);
  }
};

// @desc    update extraCharges in specific store
// @route   PUT /api/v1/stores/:id/extras
// @access  Private - admin
exports.updateExtraCharges = async (req, res, next) => {
  try {
    const { extraCharges } = req.body;
    const store = await Store.findByIdAndUpdate(
      req.params.id,
      { extraCharges },
      { $upsert: true, new: true }
    )
      .sort({ createdAt: -1 })
      .populate({ path: 'managerId', select: 'name email phone' })
      .populate({ path: 'adminId', select: 'name email' })
      .populate({ path: 'teamId', select: 'name teamId mainContact bulkShipping' })
      .select('-updatedAt -__v -items');

    return res.status(200).send([{ message: 'Extra Charges updated', store }]);
  } catch (err) {
    logger.error(err);
  }
};
