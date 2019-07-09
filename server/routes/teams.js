const { Member } = require('../models/Member');
const { Team, validateTeam } = require('../models/Team');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/teams
router.get('/', auth, async (req, res) => {
  let teams = [];
  if (req.member.admin) {
    teams = await Team.find();
    if (teams.length == 0) return res.status(404).send({ msg: 'No Teams found.' });
    return res.send(teams);
  }
  teams = await Team.find({ $or: [{ manager_id: req.member._id }, { members: req.member._id }] });
  if (teams.length == 0) return res.status(404).send({ msg: 'You are currently not a member of any teams' });
  return res.send(teams);
});

router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateTeam(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const team = await Team.findOne({ name: req.body.name });
  if (team) return res.status(400).send({ msg: 'Team name already registered, Please choose another' });
});

module.exports = router;
