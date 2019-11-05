/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const swearjar = require('swearjar');
const { Member } = require('../models/Member');
const { Team, validateTeam, validateAddMember } = require('../models/Team');
const { Store } = require('../models/Store');

const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

// @desc    Get all teams
// @route   GET /api/v1/teams/
// @access  Private
router.get('/', auth, async (req, res) => {
  let teams = [];

  // only show all teams if user is admin
  if (req.member.isAdmin) {
    teams = await Team.find()
      .populate({ path: 'managerId', select: 'name email' })
      .populate({ path: 'adminId', select: 'name email' })
      .populate({ path: 'members', select: 'name email' })
      .select('-updatedAt -__v ');

    if (teams && teams.length === 0) return res.status(404).send([{ message: 'No Teams Found.' }]);

    return res.send(teams);
  }

  // only show teams that current user is a member of
  teams = await Team.find({ members: req.member._id })
    .populate({ path: 'managerId', select: 'name email' })
    .populate({ path: 'members', select: 'name email' })
    .populate({ path: 'adminId', select: 'name email' })
    .select('-updatedAt -__v');

  if (teams.length === 0)
    return res.status(404).send([{ message: 'You are currently not a member of any teams' }]);
  return res.send(teams);
});

// @desc    Get a specific team
// @route   GET /api/v1/teams/:id
// @access  Private
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const team = await Team.findById(req.params.id)
    .populate({ path: 'managerId', select: 'name email phone' })
    .populate({ path: 'adminId', select: 'name email' })
    .populate({ path: 'members', select: 'name email' })
    .select('-updatedAt -__v');
  if (!team) return res.status(404).send([{ message: 'Team with the given ID not found.' }]);

  return res.send(team);
});

// @desc    GET a team register ?? NEEDED ?? CHECK FRONT END
// @route   GET /api/v1/teams/:id/register
// @access  Private
router.get('/:id/register', validateObjectId, async (req, res) => {
  const team = await Team.findById(req.params.id).select('_id name');
  if (!team) return res.status(404).send([{ message: 'Team with the given ID not found.' }]);

  return res.send(team);
});

// @desc    Add a new team
// @route   POST /api/v1/teams/:id
// @access  Private - admin
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateTeam(req.body);
  if (error) return res.status(400).send(error.details);

  let { name, teamId } = req.body;
  const {
    logo,
    adminId,
    managerId,
    contactName,
    contactCompany,
    contactAddress1,
    contactAddress2,
    contactCity,
    contactStateProv,
    contactCountry,
    contactZipPostal,
    contactPhone,
    contactEmail,
    shippingName,
    shippingCompany,
    shippingAddress1,
    shippingAddress2,
    shippingCity,
    shippingStateProv,
    shippingCountry,
    shippingZipPostal,
    shippingPhone,
    shippingEmail,
    timezone,
    timezoneAbbrev
  } = req.body;

  // checks team name for profanity and denies
  if (swearjar.profane(name))
    return res
      .status(400)
      .send([{ message: 'Team name must not contain profanity.', context: { key: 'name' } }]);

  name = name.toUpperCase();
  if (teamId) {
    teamId = teamId.toUpperCase();
  }

  // checks if team name or ID already is registered and denies
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

  team = new Team({
    name,
    teamId
  });

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

  team.members.push(managerId);

  if (logo !== '' || logo) {
    team.logo = logo;
  }

  team.mainContact = {
    name: contactName,
    company: contactCompany,
    address1: contactAddress1,
    address2: contactAddress2,
    city: contactCity,
    stateProv: contactStateProv,
    country: contactCountry,
    zipPostal: contactZipPostal,
    phone: contactPhone,
    email: contactEmail
  };

  team.bulkShipping = {
    name: shippingName,
    company: shippingCompany,
    address1: shippingAddress1,
    address2: shippingAddress2,
    city: shippingCity,
    stateProv: shippingStateProv,
    country: shippingCountry,
    zipPostal: shippingZipPostal,
    phone: shippingPhone,
    email: shippingEmail
  };

  team.timezone = timezone;
  team.timezoneAbbrev = timezoneAbbrev;

  await team.save();
  return res.send([{ message: 'Team Added' }]);
});

// @desc    Update a team
// @route   PUT /api/v1/teams/:id
// @access  Private
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateTeam(req.body);
  if (error) return res.status(400).send([{ message: error.details[0].message }]);

  let { name, teamId } = req.body;
  const {
    logo,
    adminId,
    managerId,
    contactName,
    contactCompany,
    contactAddress1,
    contactAddress2,
    contactCity,
    contactStateProv,
    contactCountry,
    contactZipPostal,
    contactPhone,
    contactEmail,
    shippingName,
    shippingCompany,
    shippingAddress1,
    shippingAddress2,
    shippingCity,
    shippingStateProv,
    shippingCountry,
    shippingZipPostal,
    shippingPhone,
    shippingEmail,
    timezone,
    timezoneAbbrev
  } = req.body;

  let team = await Team.findById(req.params.id);
  if (!team) return res.status(400).send([{ message: 'Team with the given ID was not found' }]);

  // checks if new team name has profanity and denies
  if (swearjar.profane(name))
    return res
      .status(400)
      .send([{ message: 'Team name must not contain profanity.', context: { key: 'name' } }]);

  name = name.toUpperCase();
  if (teamId) {
    teamId = teamId.toUpperCase();
  }

  // checks if new team name or team ID is already registered before updating
  if (team.name !== name && team.teamId !== teamId) {
    team = await Team.findOne({ $or: [{ name }, { teamId }] });
    if (team) {
      if (team.name === name) {
        return res
          .status(400)
          .send([{ message: 'Team name already registered', context: { key: 'name' } }]);
      }

      if (team.teamId === teamId) {
        return res
          .status(400)
          .send([{ message: 'Team ID already registered', context: { key: 'teamId' } }]);
      }
    }
  }

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
  team.name = name;
  team.teamId = teamId;
  if (logo !== '' || logo) {
    team.logo = logo;
  }

  team.mainContact = {
    name: contactName,
    company: contactCompany,
    address1: contactAddress1,
    address2: contactAddress2,
    city: contactCity,
    stateProv: contactStateProv,
    country: contactCountry,
    zipPostal: contactZipPostal,
    phone: contactPhone,
    email: contactEmail
  };

  team.bulkShipping = {
    name: shippingName,
    company: shippingCompany,
    address1: shippingAddress1,
    address2: shippingAddress2,
    city: shippingCity,
    stateProv: shippingStateProv,
    country: shippingCountry,
    zipPostal: shippingZipPostal,
    phone: shippingPhone,
    email: shippingEmail
  };

  team.timezone = timezone;
  team.timezoneAbbrev = timezoneAbbrev;

  await team.save();

  // updates the bulkshipping info for all team stores
  const stores = await Store.find({ teamId: team._id, mode: { $ne: 'CLOSED' } });
  if (stores.length > 0) {
    stores.forEach(async store => {
      await Store.findByIdAndUpdate(store._id, { bulkShipping: team.bulkShipping });
    });
  }

  return res.status(200).send([{ message: 'Team Updated' }]);
});

// @desc    Add a member to a specific team
// @route   GET /api/v1/coupons/:id
// @access  Private
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

  const notification = {
    date: Date.now(),
    message: `You are now part of team ${team.name}`,
    clickTo: `/dashboard/teams/${team._id}`
  };
  member.notifications.push(notification);
  await member.save();

  return res.status(200).send([{ message: 'Member Added to Team' }]);
});

router.post('/:id/removemembers', [validateObjectId, auth], async (req, res) => {
  const team = await Team.findById(req.params.id);
  if (!team) return res.status(400).send([{ message: 'Team with the given ID was not found.' }]);

  let access = false;

  if (req.member._id === team.managerId) access = true;
  if (req.member.isAdmin) access = true;
  if (!access) return res.status(403).send([{ message: 'Access Denied' }]);
  const { members } = req.body;
  const deleteMembers = members;
  await Team.updateOne({ _id: req.params.id }, { $pull: { members: { $in: deleteMembers } } });

  return res.status(200).send([{ message: 'Members Removed from Team' }]);
});

module.exports = router;
