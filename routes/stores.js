const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

const {
  getStores,
  getStore,
  getTeamStores,
  addStore,
  duplicateStore,
  updateStore,
  getStoreItems,
  updateStoreItems,
  updateExtraCharges
} = require('../controllers/stores');

router
  .route('/')
  .get(auth, getStores)
  .post(auth, admin, addStore);

router
  .route('/:id')
  .get(validateObjectId, auth, getStore)
  .put(validateObjectId, auth, admin, updateStore);

router.route('/team/:id').get(validateObjectId, auth, getTeamStores);

router.route('/:id/dup').post(validateObjectId, auth, admin, duplicateStore);

router
  .route('/:id/items')
  .get(validateObjectId, auth, getStoreItems)
  .put(validateObjectId, auth, admin, updateStoreItems);

router.route('/:id/extras').put(validateObjectId, auth, admin, updateExtraCharges);

module.exports = router;
