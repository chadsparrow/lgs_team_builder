const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const {
  getTeams,
  getTeam,
  getTeamRegister,
  addTeam,
  updateTeam,
  addMemberToTeam,
  removeMembers
} = require('../controllers/teams');

router
  .route('/')
  .get(auth, getTeams)
  .post(auth, admin, addTeam);

router
  .route('/:id')
  .get(validateObjectId, auth, getTeam)
  .put(validateObjectId, auth, admin, updateTeam);

router.route('/:id/register').get(validateObjectId, getTeamRegister);

router.route('/:id/addmember').post(validateObjectId, auth, admin, addMemberToTeam);

router.route('/:id/removemembers').post(validateObjectId, auth, admin, removeMembers);

module.exports = router;
