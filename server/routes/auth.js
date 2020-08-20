const express = require('express');
const router = express.Router();
const validateObjectId = require('../middleware/validateObjectId');
const authController = require('../controllers/auth');

router.route('/login').post(authController.login);

router.route('/register/:id').post(validateObjectId, authController.register);

router.route('/forgot').post(authController.forgotPassword);

router.route('/reset/:id').post(authController.resetPassword);

router.route('/reset').get(authController.checkResetPasswordToken);

router.route('/verifyemail').post(authController.verifyEmail);

router.route('/verify').get(authController.verifyAccount);

module.exports = router;
