const { Member } = require('../models/Member');
const { Team, validateTeam, validateTeamName } = require('../models/Team');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');

// GET /api/teams
router.get('/', auth, async (req, res) => {
  let teams = [];
  let populatedTeams = [];
  if (req.member.admin) {
    teams = await Team.find();
    if (teams.length == 0) return res.status(404).send({ msg: 'No Teams found.' });
    for (team of teams) {
      populatedTeams.push(await populateTeam(team));
    }
    return res.send(teams);
  } else {
    teams = await Team.find({ $or: [{ manager_id: req.member._id }, { members: req.member._id }] }).select('-admin_id');
    if (teams.length == 0) return res.status(404).send({ msg: 'You are currently not a member of any teams' });

    for (team of teams) {
      populatedTeams.push(await populateTeam(team));
    }

    return res.send(populatedTeams);
  }
});

// GET /api/teams/:id
router.get('/:id', auth, async (req, res) => {
  let team = {};
  if (req.member.admin) {
    team = await Team.findById(req.params.id);
  } else {
    team = await Team.findById(req.params.id).select('-admin_id');
  }
  if (!team) return res.status(404).send({ msg: 'Team with the given ID not found.' });
  const populatedTeam = await populateTeam(team);
  return res.send(populatedTeam);
});

// POST /api/teams
router.post('/', [auth, admin], async (req, res) => {
  const { error } = validateTeamName(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  const team = await Team.findOne({ name: req.body.name });
  if (team) return res.status(400).send({ msg: 'Team name already registered' });

  const newTeam = new Team({ name: req.body.name });
  const savedTeam = await newTeam.save();
  const populatedTeam = await populateTeam(savedTeam);
  res.send(populatedTeam);
});

// PUT /api/teams/:id
router.put('/:id', [auth, admin], async (req, res) => {
  const { error } = validateTeam(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let {
    logo,
    admin_id,
    manager_id,
    useManagerDetails,
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

  let team = await Team.findById(req.params.id);
  if (!team) return res.status(400).send({ msg: 'Team with the given ID was not found.' });

  const admin = await Member.lookup(admin_id);
  if (!admin) return res.status(400).send({ msg: 'Admin: Member with the given ID was not found.' });
  team.admin_id = admin_id;

  const manager = await Member.lookup(manager_id);
  if (!manager) return res.status(400).send({ msg: 'Manager: Member with the given ID was not found.' });
  team.manager_id = manager._id;

  if (logo != '' || logo) {
    team.logo = logo;
  }

  if (useManagerDetails) {
    team.contact.reference = team.manager_id;
  } else {
    team.contact.name = contact_name;
    team.contact.address1 = contact_address1;
    team.contact.address2 = contact_address2;
    team.contact.city = contact_city;
    team.contact.state_prov = contact_state_prov;
    team.contact.country = contact_country;
    team.contact.zip_postal = contact_zip_postal;
    team.contact.phone = contact_phone;
    team.contact.email = contact_email;
  }

  if (bulk_use_above_details) {
    if (team.contact.reference) {
      team.bulk_shipping.contact = team.contact.reference;
    } else {
      team.bulk_shipping.name = team.contact.name;
      team.bulk_shipping.address1 = team.contact.address1;
      team.bulk_shipping.address2 = team.contact.address2;
      team.bulk_shipping.city = team.contact.city;
      team.bulk_shipping.state_prov = team.contact.state_prov;
      team.bulk_shipping.country = team.contact.country;
      team.bulk_shipping.zip_postal = team.contact.zip_postal;
      team.bulk_shipping.phone = team.contact.phone;
      team.bulk_shipping.email = team.contact.email;
    }
  } else {
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
  const populatedTeam = await populateTeam(savedTeam);
  res.send(populatedTeam);
});

function populateTeam(team) {
  return new Promise(async (resolve, reject) => {
    const opts = [
      { path: 'manager_id', select: 'name email' },
      { path: 'admin_id', select: 'name email' },
      { path: 'members', select: 'name email' },
      { path: 'contact.reference', select: 'name address1 address2 city state_prov country zip_postal email phone' },
      { path: 'bulk_shipping.contact', select: 'name address1 address2 city state_prov country zip_postal email phone' }
    ];
    const populatedTeam = await Member.populate(team, opts);
    resolve(populatedTeam);
  });
}

module.exports = router;
