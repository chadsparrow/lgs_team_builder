/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const swearjar = require('swearjar');
const { Member } = require('../models/Member');
const { Team, validateTeam, validateTeamName, validateAddMember } = require('../models/Team');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

// GET /api/teams
router.get('/', auth, async (req, res) => {
  let teams = [];
  const completedTeams = [];
  const unfinishedTeams = [];

  if (req.member.isAdmin) {
    teams = await Team.find()
      .populate({ path: 'managerId', select: 'name email' })
      .populate({ path: 'adminId', select: 'name email' })
      .populate({ path: 'members', select: 'name email' })
      .select('-updatedAt -__v ');

    teams.forEach(team => {
      if (team.bulkShipping.address1) {
        completedTeams.push(team);
      } else {
        unfinishedTeams.push(team);
      }
    });

    if (
      completedTeams &&
      completedTeams.length === 0 &&
      unfinishedTeams &&
      unfinishedTeams.length === 0
    )
      return res.status(404).send([{ message: 'No Teams found.' }]);

    return res.send({ teams: completedTeams, unfinishedTeams });
  }

  teams = await Team.find({ $or: [{ managerId: req.member._id }, { members: req.member._id }] })
    .populate({ path: 'managerId', select: 'name email' })
    .populate({ path: 'members', select: 'name email' })
    .populate({ path: 'adminId', select: 'name email' })
    .select('-updatedAt -__v');

  teams.forEach(team => {
    if (team.mainContact.address1) {
      completedTeams.push(team);
    } else {
      unfinishedTeams.push(team);
    }
  });

  if (completedTeams && completedTeams.length === 0)
    return res.status(404).send([{ message: 'You are currently not a member of any teams' }]);
  return res.send({ teams: completedTeams, unfinishedTeams });
});

// GET /api/teams/:id
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate({ path: 'managerId', select: 'name email' })
    .populate({ path: 'adminId', select: 'name email' })
    .populate({ path: 'members', select: 'name email' })
    .select('-updatedAt -__v');
  if (!team) return res.status(404).send([{ message: 'Team with the given ID not found.' }]);

  return res.send(team);
});

// POST /api/teams
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateTeamName(req.body);
  if (error) return res.status(400).send(error.details);

  let { name, teamId } = req.body;
  const { adminId } = req.body;

  if (swearjar.profane(name))
    return res
      .status(400)
      .send([{ message: 'Team name must not contain profanity.', context: { key: 'name' } }]);

  name = name.toUpperCase();
  if (teamId) {
    teamId = teamId.toUpperCase();
  }

  let team = await Team.findOne({ $or: [{ name }, { teamId }] });
  if (team)
    if (team.name === name) {
      return res
        .status(400)
        .send([{ message: 'Team name already registered', context: { key: 'name' } }]);
    } else if (team.teamId === teamId) {
      return res
        .status(400)
        .send([{ message: 'Team ID already registered', context: { key: 'teamId' } }]);
    }

  team = new Team({ name, adminId, teamId });
  await team.save();
  return res.send([{ message: 'Team Added' }]);
});

// PUT /api/teams/:id
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateTeam(req.body);
  if (error) return res.status(400).send([{ message: error.details[0].message }]);

  const {
    logo,
    adminId,
    managerId,
    mainContact,
    bulkShipping,
    timezone,
    timezoneAbbrev
  } = req.body;

  const team = await Team.findById(req.params.id);
  if (!team) return res.status(400).send([{ message: 'Team with the given ID was not found' }]);

  const teamAdmin = await Member.findById(adminId);
  if (!teamAdmin)
    return res.status(400).send([{ message: 'Admin: Member with the given ID was not found' }]);
  if (!teamAdmin.isAdmin)
    return res.status(403).send([{ message: 'Admin: Member must have admin status' }]);

  team.adminId = adminId;

  const manager = await Member.findById(managerId);
  if (!manager)
    return res.status(400).send([{ message: 'Manager: Member with the given ID was not found' }]);
  if (manager.isAdmin)
    return res.status(403).send([{ message: 'Manager: Member cannot be an admin' }]);
  team.managerId = managerId;

  if (logo !== '' || logo) {
    team.logo = logo;
  }

  team.mainContact = mainContact;
  team.bulkShipping = bulkShipping;

  team.timezone = timezone;
  team.timezoneAbbrev = timezoneAbbrev;

  await team.save();

  return res.status(200).send([{ message: 'Team Updated' }]);
});

router.post('/:id/addmember', [validateObjectId, auth], async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(400).send([{ message: 'Team with the given ID was not found.' }]);

  let access = false;

  if (req.member._id === team.managerId) access = true;

  if (req.member.isAdmin) access = true;

  if (!access) return res.status(403).send([{ message: 'Access Denied' }]);

  const { error } = validateAddMember(req.body);
  if (error) return res.status(400).send(error.details);

  const { memberId } = req.body;

  const member = await Member.findById(memberId);
  if (!member) return res.status(400).send([{ message: 'Member with the given ID not found' }]);

  const alreadyRegistered = team.members.includes(memberId);
  if (alreadyRegistered)
    return res.status(400).send([{ message: 'Member already part of the team' }]);

  team.members.push(mongoose.Types.ObjectId(memberId));

  await team.save();

  return res.status(200).send([{ message: 'Member Added to Team' }]);
});

module.exports = router;
