const express = require('express');
const notificationsController = require('../controllers/notifications');
const router = express.Router();
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

router.route('/me').get(auth, notificationsController.getMeNotifications);
router.route('/').post(auth, notificationsController.addNotifications);
router.route('/all').delete(auth, notificationsController.deleteAllNotifications);
router.route('/:id').delete(validateObjectId, auth, notificationsController.deleteNotification);

module.exports = router;
