const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const catalogItemsController = require('../controllers/catalogitems');

router
  .route('/')
  .get(auth, catalogItemsController.getCatalogItems)
  .post(auth, admin, catalogItemsController.addCatalogItem);
router.route('/catalog/:id').get(validateObjectId, auth, catalogItemsController.getItemsForCatalog);
router
  .route('/:id')
  .get(validateObjectId, auth, catalogItemsController.getCatalogItem)
  .put(validateObjectId, auth, admin, catalogItemsController.updateCatalogItem)
  .delete(validateObjectId, auth, admin, catalogItemsController.deleteCatalogItem);

router
  .route('/img/add/:id')
  .patch(validateObjectId, auth, admin, catalogItemsController.addCatalogItemImage);

router
  .route('/img/edit/:id/:index')
  .patch(validateObjectId, auth, admin, catalogItemsController.updateCatalogItemImage);

router
  .route('/img/delete/:id/:index')
  .delete(validateObjectId, auth, admin, catalogItemsController.deleteCatalogItemImage);

module.exports = router;
