const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const teamsController = require('../controllers/teams');

router
  .route('/')
  .get(auth, teamsController.getTeams)
  .post(auth, admin, teamsController.addTeam);

router
  .route('/:id')
  .get(validateObjectId, auth, teamsController.getTeam)
  .put(validateObjectId, auth, admin, teamsController.updateTeam);

router.route('/:id/register').get(validateObjectId, teamsController.getTeamRegister);

router.route('/:id/addmember').post(validateObjectId, auth, admin, teamsController.addMemberToTeam);

router
  .route('/:id/removemembers')
  .post(validateObjectId, auth, admin, teamsController.removeMembers);

module.exports = router;
