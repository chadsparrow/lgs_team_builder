/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');
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
  if (req.member.isAdmin) {
    teams = await Team.find()
      .populate({ path: 'managerId', select: 'name email' })
      .populate({ path: 'adminId', select: 'name email' })
      .populate({ path: 'members', select: 'name email' })
      .populate({
        path: 'mainContact.memberId',
        select: 'name address1 address2 city stateProv country zipPostal email phone'
      })
      .populate({
        path: 'bulkShipping.memberId',
        select: 'name address1 address2 city stateProv country zipPostal email phone'
      })
      .select('-updatedAt -__v ');
    if (teams && teams.length === 0) return res.status(404).send([{ message: 'No Teams found.' }]);

    return res.send(teams);
  }
  teams = await Team.find({ $or: [{ managerId: req.member._id }, { members: req.member._id }] })
    .populate({ path: 'managerId', select: 'name email' })
    .populate({ path: 'members', select: 'name email' })
    .populate({
      path: 'mainContact.memberId',
      select: 'name address1 address2 city stateProv country zipPostal email phone'
    })
    .populate({
      path: 'bulkShipping.memberId',
      select: 'name address1 address2 city stateProv country zipPostal email phone'
    })
    .select('-updatedAt -__v -adminId');

  if (teams && teams.length === 0)
    return res.status(404).send([{ message: 'You are currently not a member of any teams' }]);

  return res.send(teams);
});

// GET /api/teams/:id
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  let team = {};
  if (req.member.isAdmin) {
    team = await Team.findById(req.params.id)
      .populate({ path: 'managerId', select: 'name email' })
      .populate({ path: 'adminId', select: 'name email' })
      .populate({ path: 'members', select: 'name email' })
      .populate({
        path: 'mainContact.memberId',
        select: 'name address1 address2 city stateProv country zipPostal email phone'
      })
      .populate({
        path: 'bulkShipping.memberId',
        select: 'name address1 address2 city stateProv country zipPostal email phone'
      })
      .select('-updatedAt -__v ');
  } else {
    team = await Team.findById(req.params.id)
      .populate({ path: 'managerId', select: 'name email' })
      .populate({ path: 'members', select: 'name email' })
      .populate({
        path: 'mainContact.memberId',
        select: 'name address1 address2 city stateProv country zipPostal email phone'
      })
      .populate({
        path: 'bulkShipping.memberId',
        select: 'name address1 address2 city stateProv country zipPostal email phone'
      })
      .select('-updatedAt -__v -adminId');
  }
  if (!team) return res.status(404).send([{ message: 'Team with the given ID not found.' }]);

  return res.send(team);
});

// POST /api/teams
router.post('/', [auth, admin], async (req, res) => {
  if (swearjar.profane(req.body.name))
    return res.status(400).send([{ message: 'Team name must not contain profanity.' }]);

  const { error } = validateTeamName(req.body);
  if (error) return res.status(400).send(error.details);

  const team = await Team.findOne({ name: req.body.name });
  if (team) return res.status(400).send([{ message: 'Team name already registered' }]);

  const newTeam = new Team({ name: req.body.name });
  await newTeam.save();
  return res.send(_.pick(newTeam, ['_id', 'name']));
});

// PUT /api/teams/:id
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateTeam(req.body);
  if (error) return res.status(400).send([{ message: error.details[0].message }]);

  const {
    logo,
    adminId,
    managerId,
    useManagerDetails,
    contactName,
    contactAddress1,
    contactAddress2,
    contactCity,
    contactStateProv,
    contactCountry,
    contactZipPostal,
    contactPhone,
    contactEmail,
    bulkUseAboveDetails,
    bulkContactName,
    bulkContactAddress1,
    bulkContactAddress2,
    bulkContactCity,
    bulkContactStateProv,
    bulkContactCountry,
    bulkContactZipPostal,
    bulkContactPhone,
    bulkContactEmail
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

  if (useManagerDetails) {
    team.mainContact.memberId = team.managerId;
  } else {
    team.mainContact.memberId = null;
    team.mainContact.name = contactName;
    team.mainContact.address1 = contactAddress1;
    team.mainContact.address2 = contactAddress2;
    team.mainContact.city = contactCity;
    team.mainContact.stateProv = contactStateProv;
    team.mainContact.country = contactCountry;
    team.mainContact.zipPostal = contactZipPostal;
    team.mainContact.phone = contactPhone;
    team.mainContact.email = contactEmail;
  }

  if (bulkUseAboveDetails) {
    if (team.mainContact.memberId) {
      team.bulkShipping.memberId = team.mainContact.memberId;
    } else {
      team.bulkShipping.memberId = null;
      team.bulkShipping.name = team.mainContact.name;
      team.bulkShipping.address1 = team.mainContact.address1;
      team.bulkShipping.address2 = team.mainContact.address2;
      team.bulkShipping.city = team.mainContact.city;
      team.bulkShipping.stateProv = team.mainContact.stateProv;
      team.bulkShipping.country = team.mainContact.country;
      team.bulkShipping.zipPostal = team.mainContact.zipPostal;
      team.bulkShipping.phone = team.mainContact.phone;
      team.bulkShipping.email = team.mainContact.email;
    }
  } else {
    team.bulkShipping.memberId = null;
    team.bulkShipping.name = bulkContactName;
    team.bulkShipping.address1 = bulkContactAddress1;
    team.bulkShipping.address2 = bulkContactAddress2;
    team.bulkShipping.city = bulkContactCity;
    team.bulkShipping.stateProv = bulkContactStateProv;
    team.bulkShipping.country = bulkContactCountry;
    team.bulkShipping.zipPostal = bulkContactZipPostal;
    team.bulkShipping.phone = bulkContactPhone;
    team.bulkShipping.email = bulkContactEmail;
  }

  const savedTeam = await team.save();

  const populatedTeam = await Team.findById(savedTeam._id)
    .populate({ path: 'managerId', select: 'name email' })
    .populate({ path: 'adminId', select: 'name email' })
    .populate({ path: 'members', select: 'name email' })
    .populate({
      path: 'mainContact.memberId',
      select: 'name address1 address2 city stateProv country zipPostal email phone'
    })
    .populate({
      path: 'bulkShipping.memberId',
      select: 'name address1 address2 city stateProv country zipPostal email phone'
    })
    .select('-updatedAt -__v');

  return res.status(200).send(populatedTeam);
});

router.post('/:id/add', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateAddMember(req.body);
  if (error) return res.status(400).send(error.details);

  const { memberId } = req.body;

  const member = await Member.findById(memberId);
  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  const team = await Team.findById(req.params.id);
  if (!team) return res.status(400).send([{ message: 'Team with the given ID was not found.' }]);

  const alreadyRegistered = team.members.includes(req.body.memberId);
  if (alreadyRegistered)
    return res.status(400).send([{ message: 'Member already part of the team' }]);

  team.members.push(mongoose.Types.ObjectId(memberId));

  const savedTeam = await team.save();

  const populatedTeam = await Team.findById(savedTeam._id)
    .populate({ path: 'managerId', select: 'name email' })
    .populate({ path: 'adminId', select: 'name email' })
    .populate({ path: 'members', select: 'name email' })
    .populate({
      path: 'mainContact.memberId',
      select: 'name address1 address2 city stateProv country zipPostal email phone'
    })
    .populate({
      path: 'bulkShipping.memberId',
      select: 'name address1 address2 city stateProv country zipPostal email phone'
    })
    .select('-updatedAt -__v');

  return res.status(200).send(populatedTeam);
});

module.exports = router;
