const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const catalogController = require('../controllers/catalogs');

router
  .route('/')
  .get(auth, admin, catalogController.getCatalogs)
  .post(auth, admin, catalogController.addCatalog);

router
  .route('/:id')
  .get(validateObjectId, auth, admin, catalogController.getCatalog)
  .put(validateObjectId, auth, admin, catalogController.updateCatalog);

router
  .route('/:id/coverImg')
  .patch(validateObjectId, auth, admin, catalogController.updateCatalogCover);

module.exports = router;
