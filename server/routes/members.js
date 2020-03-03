const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const membersController = require('../controllers/members');

router.route('/').get(auth, admin, membersController.getMembers);

router.route('/admins').get(auth, membersController.getAdmins);

router
  .route('/:id')
  .get(validateObjectId, auth, membersController.getMember)
  .put(validateObjectId, auth, membersController.updateMember)
  .delete(validateObjectId, auth, admin, membersController.deactivateMember);

router.route('/:id/details').get(validateObjectId, auth, membersController.getMemberDetails);

router.route('/:id/me').get(validateObjectId, auth, membersController.getMyDetails);

router.route('/register').post(auth, admin, membersController.adminRegisterMember);

router.route('/email/:id').patch(validateObjectId, auth, membersController.updateEmailAddress);

router.route('/password/:id').patch(validateObjectId, auth, membersController.updatePassword);

router.route('/:id/notification/:nId').delete(auth, membersController.deleteNotification);

module.exports = router;
