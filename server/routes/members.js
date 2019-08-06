const _ = require('lodash');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const moment = require('moment-timezone');
const mongoose = require('mongoose');

const { Member, validateNewMember, validateUpdateMember, validateEmail, validatePassword } = require('../models/Member');
const { Email } = require('../models/Email');
let selectString = '';

// GET /api/members
router.get('/', auth, async (req, res) => {
  const members = await Member.find().select('avatar_url _id name email isAdmin');

  if (members && members.length === 0) return res.status(404).send({ message: 'There are no members in the database.' });
  res.json(members);
});

router.get('/me', auth, async (req, res) => {
  const emails = await Email.find({
    $or: [
      { recipients: { $elemMatch: { member: mongoose.Types.ObjectId(req.member._id) } } },
      { messages: { $elemMatch: { sentBy: mongoose.Types.ObjectId(req.member._id) } } }
    ]
  })
    .populate({ path: 'sender', select: 'name email' })
    .populate({ path: 'recipients.member', select: 'name email' })
    .populate({ path: 'messages.sentBy', select: 'name email' })
    .sort('-messages.date');

  const member = await Member.findById(req.member._id);
  return res.json({ member: _.pick(member, ['avatar_url', '_id', 'name', 'email', 'isAdmin']), emails });
});

// GET /api/members/:id
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const member = await Member.findById(req.params.id).select(selectString);
  if (!member) return res.status(400).send({ message: 'Member with the given ID was not found.' });

  res.json(_.pick(member, ['_id', 'avatar_url', 'name', 'email']));
});

// POST /api/members
router.post('/register', async (req, res) => {
  const { error } = validateNewMember(req.body);
  if (error) return res.status(400).send(error.details);

  let {
    name,
    address1,
    address2,
    city,
    state_prov,
    country,
    zip_postal,
    phone,
    email,
    password,
    shipping_same,
    shipping_name,
    shipping_address1,
    shipping_address2,
    shipping_city,
    shipping_state_prov,
    shipping_country,
    shipping_zip_postal,
    shipping_phone,
    shipping_email
  } = req.body;

  let member = await Member.findOne({ email });
  if (member) return res.status(400).send({ message: 'Member already registered.' });

  const newMember = new Member({
    name,
    address1,
    address2,
    city,
    state_prov,
    country,
    zip_postal,
    phone,
    email,
    isAdmin: false
  });

  newMember.notifications.push({ date: new Date(), message: 'Welcome to Team Builder!' });

  const salt = await bcrypt.genSalt(10);
  newMember.password = await bcrypt.hash(password, salt);

  if (shipping_same) {
    newMember.shipping_name = newMember.name;
    newMember.shipping_address1 = newMember.address1;
    newMember.shipping_address2 = newMember.address2;
    newMember.shipping_city = newMember.city;
    newMember.shipping_state_prov = newMember.state_prov;
    newMember.shipping_country = newMember.country;
    newMember.shipping_zip_postal = newMember.zip_postal;
    newMember.shipping_phone = newMember.phone;
    newMember.shipping_email = newMember.email;
  } else {
    newMember.shipping_name = shipping_name;
    newMember.shipping_address1 = shipping_address1;
    newMember.shipping_address2 = shipping_address2;
    newMember.shipping_city = shipping_city;
    newMember.shipping_state_prov = shipping_state_prov;
    newMember.shipping_country = shipping_country;
    newMember.shipping_zip_postal = shipping_zip_postal;
    newMember.shipping_phone = shipping_phone;
    newMember.shipping_email = shipping_email;
  }

  await newMember.save();

  res.json(_.pick(newMember, ['_id', 'name', 'email']));
});

// PUT /api/members/:id
router.put('/:id', [validateObjectId, auth], async (req, res) => {
  const { error } = validateUpdateMember(req.body);
  if (error) return res.status(400).send(error.details);

  let {
    name,
    address1,
    address2,
    city,
    state_prov,
    country,
    zip_postal,
    phone,
    shipping_same,
    shipping_name,
    shipping_address1,
    shipping_address2,
    shipping_city,
    shipping_state_prov,
    shipping_country,
    shipping_zip_postal,
    shipping_phone,
    shipping_email,
    isAdmin
  } = req.body;

  if (!req.member.isAdmin && isAdmin) return res.status(403).send({ message: 'Access Denied.' });

  let member = await Member.findById(req.params.id);
  if (!member) return res.status(400).send({ message: 'Member with the given ID was not found.' });

  member.name = name;
  member.address1 = address1;
  member.address2 = address2;
  member.city = city;
  member.state_prov = state_prov;
  member.country = country;
  member.zip_postal = zip_postal;
  member.phone = phone;
  member.isAdmin = isAdmin;

  if (shipping_same) {
    member.shipping_name = member.name;
    member.shipping_address1 = member.address1;
    member.shipping_address2 = member.address2;
    member.shipping_city = member.city;
    member.shipping_state_prov = member.state_prov;
    member.shipping_country = member.country;
    member.shipping_zip_postal = member.zip_postal;
    member.shipping_phone = member.phone;
    member.shipping_email = member.email;
  } else {
    member.shipping_name = shipping_name;
    member.shipping_address1 = shipping_address1;
    member.shipping_address2 = shipping_address2;
    member.shipping_city = shipping_city;
    member.shipping_state_prov = shipping_state_prov;
    member.shipping_country = shipping_country;
    member.shipping_zip_postal = shipping_zip_postal;
    member.shipping_phone = shipping_phone;
    member.shipping_email = shipping_email;
  }

  await member.save();

  res.json(_.pick(member, ['_id', 'name', 'email']));
});

// PATCH /api/members/email/:id
router.patch('/email/:id', [validateObjectId, auth], async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error.details);

  let member = await Member.findById(req.params.id);
  if (!member) return res.status(400).send({ message: 'Member with the given ID was not found.' });

  if (member.email === req.body.email) {
    return res.status(400).send({ message: 'Email is identical to what is already set.' });
  }

  const emailCheck = await Member.findOne({
    _id: { $ne: req.params.id },
    email: req.body.email
  });

  if (emailCheck) {
    return res.status(400).send({ message: 'Member with the given email address already registered' });
  }

  member = await Member.findByIdAndUpdate({ _id: req.params.id }, { email: req.body.email }, { new: true });

  res.json(_.pick(member, ['_id', 'name', 'email']));
});

// PATCH /api/members/password/:id
router.patch('/password/:id', [validateObjectId, auth], async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error.details);

  let member = await Member.findById(req.params.id);
  if (!member) return res.status(400).send({ message: 'Member with the given ID was not found.' });

  const result = bcrypt.compare(req.body.oldpassword, member.password);
  if (!result) return res.status(400).send({ message: 'Password incorrect.' });

  const salt = await bcrypt.genSalt(10);
  const hash = await brcrypt.hash(req.body.newpassword, salt);

  member.password = hash;
  await member.save();

  res.json(_.pick(member, ['_id', 'name', 'email']));
});

// DELETE /api/members/:id
router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.findByIdAndRemove(req.params.id);
  if (!member) return res.status(400).send({ message: 'Member with the given ID was not found.' });
  res.send(`Deleted - ${_.pick(member, ['_id', 'name', 'email'])}`);
});

module.exports = router;
