/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const cryptr = require('../middleware/cryptr');
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

// GET /api/members
router.get('/', auth, async (req, res) => {
  const members = await Member.find().select('avatarUrl _id name email isAdmin');

  if (members && members.length === 0)
    return res.status(404).json({ message: 'There are no members in the database.' });

  return res.json(members);
});

router.get('/me', auth, async (req, res) => {
  const emails = await Email.find({
    $or: [
      { recipients: { $elemMatch: { memberId: mongoose.Types.ObjectId(req.member._id) } } },
      { messages: { $elemMatch: { senderId: mongoose.Types.ObjectId(req.member._id) } } }
    ]
  })
    .populate({ path: 'senderId', select: 'name email' })
    .populate({ path: 'recipients.memberId', select: 'name email' })
    .populate({ path: 'messages.senderId', select: 'name email' })
    .sort('-messages.date');

  const member = await Member.findById(req.member._id);

  return res.json({
    member: _.pick(member, ['avatarUrl', '_id', 'name', 'email', 'isAdmin']),
    emails
  });
});

// GET /api/members/:id
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });

  return res.json(_.pick(member, ['_id', 'avatarUrl', 'name', 'email']));
});

// POST /api/members
router.post('/register', [auth, admin], async (req, res) => {
  const { error } = validateNewMember(req.body);
  if (error) return res.status(400).json(error.details);

  const {
    name,
    address1,
    address2,
    city,
    stateProv,
    country,
    zipPostal,
    phone,
    email,
    password,
    shippingSame,
    shippingName,
    shippingAddress1,
    shippingAddress2,
    shippingCity,
    shippingStateProv,
    shippingCountry,
    shippingZipPostal,
    shippingPhone,
    shippingEmail
  } = req.body;

  const userEmail = email.split('@')[0];
  if (password.includes('password'))
    return res.status(400).json({ message: "Please do not use 'password' in your password" });
  if (password.includes(userEmail))
    return res
      .status(400)
      .json({ message: 'Please do not use your email username in your password' });

  const member = await Member.findOne({ email: cryptr.encrypt(email) });
  if (member) return res.status(400).json({ message: 'Member already registered.' });

  const newMember = new Member({
    name,
    address1: cryptr.encrypt(address1),
    address2: cryptr.encrypt(address2),
    city,
    stateProv,
    country,
    zipPostal,
    phone: cryptr.encrypt(phone),
    email: cryptr.encrypt(email),
    isAdmin: false
  });

  newMember.notifications.push({ date: new Date(), message: 'Welcome to Team Builder!' });

  const salt = await bcrypt.genSalt(10);
  newMember.password = await bcrypt.hash(password, salt);

  if (shippingSame) {
    newMember.shipping.name = newMember.name;
    newMember.shipping.address1 = newMember.address1;
    newMember.shipping.address2 = newMember.address2;
    newMember.shipping.city = newMember.city;
    newMember.shipping.stateProv = newMember.stateProv;
    newMember.shipping.country = newMember.country;
    newMember.shipping.zipPostal = newMember.zipPostal;
    newMember.shipping.phone = newMember.phone;
    newMember.shipping.email = newMember.email;
  } else {
    newMember.shipping.name = shippingName;
    newMember.shipping.address1 = cryptr.encrypt(shippingAddress1);
    newMember.shipping.address2 = cryptr.encrypt(shippingAddress2);
    newMember.shipping.city = shippingCity;
    newMember.shipping.stateProv = shippingStateProv;
    newMember.shipping.country = shippingCountry;
    newMember.shipping.zipPostal = shippingZipPostal;
    newMember.shipping.phone = cryptr.encrypt(shippingPhone);
    newMember.shipping.email = cryptr.encrypt(shippingEmail);
  }

  await newMember.save();

  return res.json(_.pick(newMember, ['_id', 'name', 'email']));
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
    stateProv,
    country,
    zipPostal,
    phone,
    shippingSame,
    shippingName,
    shippingAddress1,
    shippingAddress2,
    shippingCity,
    shippingStateProv,
    shippingCountry,
    shippingZipPostal,
    shippingPhone,
    shippingEmail,
    isAdmin
  } = req.body;

  if (!req.member.isAdmin && isAdmin) return res.status(403).json({ message: 'Access Denied.' });

  const member = await Member.findById(req.params.id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });

  member.name = name;
  member.address1 = cryptr.encrypt(address1);
  member.address2 = cryptr.encrypt(address2);
  member.city = city;
  member.stateProv = stateProv;
  member.country = country;
  member.zipPostal = zipPostal;
  member.phone = cryptr.encrypt(phone);
  member.isAdmin = isAdmin;

  if (shippingSame) {
    member.shipping.name = member.name;
    member.shipping.address1 = member.address1;
    member.shipping.address2 = member.address2;
    member.shipping.city = member.city;
    member.shipping.stateProv = member.stateProv;
    member.shipping.country = member.country;
    member.shipping.zipPostal = member.zipPostal;
    member.shipping.phone = member.phone;
    member.shipping.email = member.email;
  } else {
    member.shipping.name = shippingName;
    member.shipping.address1 = cryptr.encrypt(shippingAddress1);
    member.shipping.address2 = cryptr.encrypt(shippingAddress2);
    member.shipping.city = shippingCity;
    member.shipping.stateProv = shippingStateProv;
    member.shipping.country = shippingCountry;
    member.shipping.zipPostal = shippingZipPostal;
    member.shipping.phone = cryptr.encrypt(shippingPhone);
    member.shipping.email = cryptr.encrypt(shippingEmail);
  }

  await member.save();

  return res.json(_.pick(member, ['_id', 'name', 'email']));
});

// PATCH /api/members/email/:id
router.patch('/email/:id', [validateObjectId, auth], async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).json(error.details);

  const { email } = req.body;

  let member = await Member.findById(req.params.id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });

  if (cryptr.decrypt(member.email) === email) {
    return res.status(400).json({ message: 'Email is identical to what is already set.' });
  }

  const emailCheck = await Member.findOne({
    _id: { $ne: req.params.id },
    email: cryptr.encrypt(email)
  });

  if (emailCheck) {
    return res
      .status(400)
      .json({ message: 'Member with the given email address already registered' });
  }

  member = await Member.findByIdAndUpdate(
    { _id: req.params.id },
    { email: cryptr.encrypt(email) },
    { new: true }
  );

  return res.status(200).json({ message: 'Member email updated' });
});

// PATCH /api/members/password/:id
router.patch('/password/:id', [validateObjectId, auth], async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).json(error.details);

  const { oldpassword, newpassword } = req.body;

  const member = await Member.findById(req.params.id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });

  const result = await bcrypt.compare(oldpassword, member.password);
  if (!result) return res.status(400).json({ message: 'Password incorrect.' });

  const userEmail = cryptr.decrypt(member.email).split('@')[0];

  if (newpassword.includes('password'))
    return res.status(400).json({ message: "Please do not use 'password' in your password" });
  if (newpassword.includes(userEmail))
    return res
      .status(400)
      .json({ message: 'Please do not use your email username in your password' });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newpassword, salt);

  member.password = hash;
  await member.save();

  return res.status(200).json({ message: 'Member password updated' });
});

// DELETE /api/members/:id
router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.findByIdAndRemove(req.params.id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });
  return res.status(200).json({ message: 'Member deleted' });
});

module.exports = router;
