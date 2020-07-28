const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const authController = require('../controllers/auth');

router.route('/login').post(authController.memberLogin);
router
  .route('/register/:id')
  .post(validateObjectId, authController.memberRegister);
router.route('/forgot').post(authController.forgotPassword);

module.exports = router;
