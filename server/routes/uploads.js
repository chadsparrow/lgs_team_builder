const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const uploadsController = require('../controllers/uploads');

router.route('/').post(auth, admin, uploadsController.uploadFile);

module.exports = router;
