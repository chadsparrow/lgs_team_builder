const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const storesController = require('../controllers/stores');

router
  .route('/')
  .get(auth, getStores)
  .post(auth, admin, addStore);

router
  .route('/:id')
  .get(validateObjectId, auth, storesController.getStore)
  .put(validateObjectId, auth, admin, storesController.updateStore);

router.route('/team/:id').get(validateObjectId, auth, storesController.getTeamStores);

router.route('/:id/dup').post(validateObjectId, auth, admin, storesController.duplicateStore);

router
  .route('/:id/items')
  .get(validateObjectId, auth, storesController.getStoreItems)
  .put(validateObjectId, auth, admin, storesController.updateStoreItems);

router.route('/:id/extras').put(validateObjectId, auth, admin, storesController.updateExtraCharges);

module.exports = router;
