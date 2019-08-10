/* eslint-disable camelcase */
/* eslint-disable consistent-return */
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
  if (req.member.is_admin) {
    teams = await Team.find()
      .populate({ path: 'manager_id', select: 'name email' })
      .populate({ path: 'admin_id', select: 'name email' })
      .populate({ path: 'members', select: 'name email' })
      .populate({
        path: 'main_contact.contact',
        select: 'name address1 address2 city state_prov country zip_postal email phone'
      })
      .populate({
        path: 'bulk_shipping.contact',
        select: 'name address1 address2 city state_prov country zip_postal email phone'
      })
      .select('-updatedAt -__v ');
    if (teams && teams.length === 0) return res.status(404).json({ message: 'No Teams found.' });

    return res.json(teams);
  }
  teams = await Team.find({ $or: [{ manager_id: req.member._id }, { members: req.member._id }] })
    .populate({ path: 'manager_id', select: 'name email' })
    .populate({ path: 'members', select: 'name email' })
    .populate({
      path: 'main_contact.contact',
      select: 'name address1 address2 city state_prov country zip_postal email phone'
    })
    .populate({
      path: 'bulk_shipping.contact',
      select: 'name address1 address2 city state_prov country zip_postal email phone'
    })
    .select('-updatedAt -__v -admin_id');

  if (teams && teams.length === 0)
    return res.status(404).json({ message: 'You are currently not a member of any teams' });

  return res.json(teams);
});

// GET /api/teams/:id
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  let team = {};
  if (req.member.isAdmin) {
    team = await Team.findById(req.params.id)
      .populate({ path: 'manager_id', select: 'name email' })
      .populate({ path: 'admin_id', select: 'name email' })
      .populate({ path: 'members', select: 'name email' })
      .populate({
        path: 'main_contact.contact',
        select: 'name address1 address2 city state_prov country zip_postal email phone'
      })
      .populate({
        path: 'bulk_shipping.contact',
        select: 'name address1 address2 city state_prov country zip_postal email phone'
      })
      .select('-updatedAt -__v ');
  } else {
    team = await Team.findById(req.params.id)
      .populate({ path: 'manager_id', select: 'name email' })
      .populate({ path: 'members', select: 'name email' })
      .populate({
        path: 'main_contact.contact',
        select: 'name address1 address2 city state_prov country zip_postal email phone'
      })
      .populate({
        path: 'bulk_shipping.contact',
        select: 'name address1 address2 city state_prov country zip_postal email phone'
      })
      .select('-updatedAt -__v -admin_id');
  }
  if (!team) return res.status(404).json({ message: 'Team with the given ID not found.' });

  return res.json(team);
});

// POST /api/teams
router.post('/', [auth, admin], async (req, res) => {
  if (swearjar.profane(req.body.name))
    return res.status(400).json({ message: 'Team name must not contain profanity.' });

  const { error } = validateTeamName(req.body);
  if (error) return res.status(400).json(error.details);

  const team = await Team.findOne({ name: req.body.name });
  if (team) return res.status(400).json({ message: 'Team name already registered' });

  const newTeam = new Team({ name: req.body.name });
  await newTeam.save();
  res.json(_.pick(newTeam, ['_id', 'name']));
});

// PUT /api/teams/:id
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateTeam(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const {
    logo,
    admin_id,
    manager_id,
    use_manager_details,
    contact_name,
    contact_address1,
    contact_address2,
    contact_city,
    contact_state_prov,
    contact_country,
    contact_zip_postal,
    contact_phone,
    contact_email,
    bulk_use_above_details,
    bulk_contact_name,
    bulk_contact_address1,
    bulk_contact_address2,
    bulk_contact_city,
    bulk_contact_state_prov,
    bulk_contact_country,
    bulk_contact_zip_postal,
    bulk_contact_phone,
    bulk_contact_email
  } = req.body;

  const team = await Team.findById(req.params.id);
  if (!team) return res.status(400).json({ message: 'Team with the given ID was not found' });

  // eslint-disable-next-line no-shadow
  const admin = await Member.findById(admin_id);
  if (!admin)
    return res.status(400).json({ message: 'Admin: Member with the given ID was not found' });
  if (!admin.is_admin)
    return res.status(403).json({ message: 'Admin: Member must have admin status' });

  team.admin_id = admin_id;

  const manager = await Member.findById(manager_id);
  if (!manager)
    return res.status(400).json({ message: 'Manager: Member with the given ID was not found' });
  if (manager.is_admin)
    return res.status(403).json({ message: 'Manager: Member cannot be an admin' });
  team.manager_id = manager._id;

  if (logo !== '' || logo) {
    team.logo = logo;
  }

  if (use_manager_details) {
    team.main_contact.member_id = team.manager_id;
  } else {
    team.main_contact.member_id = null;
    team.main_contact.name = contact_name;
    team.main_contact.address1 = contact_address1;
    team.main_contact.address2 = contact_address2;
    team.main_contact.city = contact_city;
    team.main_contact.state_prov = contact_state_prov;
    team.main_contact.country = contact_country;
    team.main_contact.zip_postal = contact_zip_postal;
    team.main_contact.phone = contact_phone;
    team.main_contact.email = contact_email;
  }

  if (bulk_use_above_details) {
    if (team.main_contact.member_id) {
      team.bulk_shipping.member_id = team.main_contact.member_id;
    } else {
      team.bulk_shipping.member_id = null;
      team.bulk_shipping.name = team.main_contact.name;
      team.bulk_shipping.address1 = team.main_contact.address1;
      team.bulk_shipping.address2 = team.main_contact.address2;
      team.bulk_shipping.city = team.main_contact.city;
      team.bulk_shipping.state_prov = team.main_contact.state_prov;
      team.bulk_shipping.country = team.main_contact.country;
      team.bulk_shipping.zip_postal = team.main_contact.zip_postal;
      team.bulk_shipping.phone = team.main_contact.phone;
      team.bulk_shipping.email = team.main_contact.email;
    }
  } else {
    team.bulk_shipping.member_id = null;
    team.bulk_shipping.name = bulk_contact_name;
    team.bulk_shipping.address1 = bulk_contact_address1;
    team.bulk_shipping.address2 = bulk_contact_address2;
    team.bulk_shipping.city = bulk_contact_city;
    team.bulk_shipping.state_prov = bulk_contact_state_prov;
    team.bulk_shipping.country = bulk_contact_country;
    team.bulk_shipping.zip_postal = bulk_contact_zip_postal;
    team.bulk_shipping.phone = bulk_contact_phone;
    team.bulk_shipping.email = bulk_contact_email;
  }

  const savedTeam = await team.save();

  const populatedTeam = await Team.findById(savedTeam._id)
    .populate({ path: 'manager_id', select: 'name email' })
    .populate({ path: 'admin_id', select: 'name email' })
    .populate({ path: 'members', select: 'name email' })
    .populate({
      path: 'main_contact.member_id',
      select: 'name address1 address2 city state_prov country zip_postal email phone'
    })
    .populate({
      path: 'bulk_shipping.member_id',
      select: 'name address1 address2 city state_prov country zip_postal email phone'
    })
    .select('-updatedAt -__v');

  res.status(200).json(populatedTeam);
});

router.post('/:id/add', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateAddMember(req.body);
  if (error) return res.status(400).json(error.details);

  const { member_id } = req.body;

  const member = await Member.findById(member_id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });

  const team = await Team.findById(req.params.id);
  if (!team) return res.status(400).json({ message: 'Team with the given ID was not found.' });

  const already_registered = team.members.includes(req.body.member_id);
  if (already_registered)
    return res.status(400).json({ message: 'Member already part of the team' });

  team.members.push(mongoose.Types.ObjectId(member._id));

  const savedTeam = await team.save();

  const populatedTeam = await Team.findById(savedTeam._id)
    .populate({ path: 'manager_id', select: 'name email' })
    .populate({ path: 'admin_id', select: 'name email' })
    .populate({ path: 'members', select: 'name email' })
    .populate({
      path: 'main_contact.member_id',
      select: 'name address1 address2 city state_prov country zip_postal email phone'
    })
    .populate({
      path: 'bulk_shipping.member_id',
      select: 'name address1 address2 city state_prov country zip_postal email phone'
    })
    .select('-updatedAt -__v');

  res.status(200).json(populatedTeam);
});

module.exports = router;
