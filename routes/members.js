/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
const _ = require('lodash');
const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

const {
  Member,
  validateNewMember,
  validateUpdateMember,
  validateEmail,
  validatePassword
} = require('../models/Member');
const { Email } = require('../models/Email');

const selectString = '';

// GET /api/members
router.get('/', auth, async (req, res) => {
  const members = await Member.find().select('avatar_url _id name email is_admin');

  if (members && members.length === 0)
    return res.status(404).json({ message: 'There are no members in the database.' });
  res.json(members);
});

router.get('/me', auth, async (req, res) => {
  const emails = await Email.find({
    $or: [
      { recipients: { $elemMatch: { member_id: mongoose.Types.ObjectId(req.member._id) } } },
      { messages: { $elemMatch: { sender_id: mongoose.Types.ObjectId(req.member._id) } } }
    ]
  })
    .populate({ path: 'sender_id', select: 'name email' })
    .populate({ path: 'recipients.member_id', select: 'name email' })
    .populate({ path: 'messages.sender_id', select: 'name email' })
    .sort('-messages.date');

  const member = await Member.findById(req.member._id);
  return res.json({
    member: _.pick(member, ['avatar_url', '_id', 'name', 'email', 'is_admin']),
    emails
  });
});

// GET /api/members/:id
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const member = await Member.findById(req.params.id).select(selectString);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });

  res.json(_.pick(member, ['_id', 'avatar_url', 'name', 'email']));
});

// POST /api/members
router.post('/register', async (req, res) => {
  const { error } = validateNewMember(req.body);
  if (error) return res.status(400).json(error.details);

  const {
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

  const userEmail = email.split('@')[0];
  if (password.includes('password'))
    return res.status(400).json({ message: "Please do not use 'password' in your password" });
  if (password.includes(userEmail))
    return res
      .status(400)
      .json({ message: 'Please do not use your email username in your password' });

  const member = await Member.findOne({ email });
  if (member) return res.status(400).json({ message: 'Member already registered.' });

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
    is_admin: false
  });

  newMember.notifications.push({ date: Date.now(), message: 'Welcome to Team Builder!' });

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
  if (error) return res.status(400).json(error.details);

  const {
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
    is_admin
  } = req.body;

  if (!req.member.is_admin && is_admin) return res.status(403).json({ message: 'Access Denied.' });

  const member = await Member.findById(req.params.id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });

  member.name = name;
  member.address1 = address1;
  member.address2 = address2;
  member.city = city;
  member.state_prov = state_prov;
  member.country = country;
  member.zip_postal = zip_postal;
  member.phone = phone;
  member.is_admin = is_admin;

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
  if (error) return res.status(400).json(error.details);

  let member = await Member.findById(req.params.id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });

  if (member.email === req.body.email) {
    return res.status(400).json({ message: 'Email is identical to what is already set.' });
  }

  const emailCheck = await Member.findOne({
    _id: { $ne: req.params.id },
    email: req.body.email
  });

  if (emailCheck) {
    return res
      .status(400)
      .json({ message: 'Member with the given email address already registered' });
  }

  member = await Member.findByIdAndUpdate(
    { _id: req.params.id },
    { email: req.body.email },
    { new: true }
  );

  res.status(200).json({ message: 'Member email updated' });
});

// PATCH /api/members/password/:id
router.patch('/password/:id', [validateObjectId, auth], async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).json(error.details);

  const member = await Member.findById(req.params.id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });

  const result = await bcrypt.compare(req.body.oldpassword, member.password);
  if (!result) return res.status(400).json({ message: 'Password incorrect.' });

  const userEmail = member.email.split('@')[0];

  if (req.body.newpassword.includes('password'))
    return res.status(400).json({ message: "Please do not use 'password' in your password" });
  if (req.body.newpassword.includes(userEmail))
    return res
      .status(400)
      .json({ message: 'Please do not use your email username in your password' });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(req.body.newpassword, salt);

  member.password = hash;
  await member.save();

  res.status(200).json({ message: 'Member password updated' });
});

// DELETE /api/members/:id
router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.findByIdAndRemove(req.params.id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });
  res.status(200).json({ message: 'Member deleted' });
});

module.exports = router;
