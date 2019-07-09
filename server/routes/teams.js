const { Member } = require('../models/Member');
const { Team, validateTeam } = require('../models/Team');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/teams
router.get('/', auth, async (req, res) => {
  let teams = [];
  if (req.member.admin) {
    teams = await Team.find();
    if (teams.length == 0) return res.status(404).send('No Teams found.');
    return res.send(teams);
  }
  teams = await Team.find({ $or: [{ manager_id: req.member._id }, { members: req.member._id }] });
  if (teams.length == 0) return res.status(404).send('You are currently not a member to any teams');
  return res.send(teams);
});

module.exports = router;
