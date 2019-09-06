/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const express = require('express');
const generator = require('generate-password');

const router = express.Router();
const bcrypt = require('bcryptjs');
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

// GET /api/members
router.get('/', [auth, admin], async (req, res) => {
  const members = await Member.find({ _id: { $ne: req.member._id } })
    .select('_id name email isAdmin')
    .sort({ name: 1 });

  if (members && members.length === 0)
    return res.status(404).send([{ message: 'There are no members in the database.' }]);

  return res.send(members);
});

// GET /api/members/:id
router.get('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  return res.send(
    _.pick(member, ['_id', 'name', 'email', 'createdAt', 'avatarUrl', 'timezone', 'isAdmin'])
  );
});

// GET /api/members/details/:id
router.get('/:id/details', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.findById(req.params.id).select(
    '_id name email address1 address2 city stateProv country zipPostal phone timezone timezoneAbbrev shipping avatarUrl isAdmin createdAt'
  );

  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  member.address1 = cryptr.decrypt(member.address1);
  member.phone = cryptr.decrypt(member.phone);
  if (member.address2) {
    member.address2 = cryptr.decrypt(member.address2);
  } else {
    member.address2 = '';
  }
  member.shipping.address1 = cryptr.decrypt(member.shipping.address1);
  if (member.shipping.address2) {
    member.shipping.address2 = cryptr.decrypt(member.shipping.address2);
  } else {
    member.shipping.address2 = '';
  }
  member.shipping.phone = cryptr.decrypt(member.shipping.phone);
  return res.send(member);
});

// POST /api/members
router.post('/register', [auth, admin], async (req, res) => {
  const { error } = validateNewMember(req.body);
  if (error) return res.status(400).send(error.details);

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
    timezone,
    timezoneAbbrev,
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

  const member = await Member.findOne({ email });
  if (member) return res.status(400).send([{ message: 'Member already registered.' }]);

  const newMember = new Member({
    name,
    address1: cryptr.encrypt(address1),
    city,
    stateProv,
    country,
    zipPostal,
    phone: cryptr.encrypt(phone),
    email,
    timezone,
    timezoneAbbrev,
    isAdmin: false
  });

  if (address2) {
    newMember.address2 = cryptr.encrypt(address2);
  }

  newMember.notifications.push({ date: new Date(), message: 'Welcome to Team Builder!' });
  const password = generator.generate({ length: 10, numbers: true });
  // console.log(password);
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
    if (shippingAddress2) {
      newMember.shipping.address2 = cryptr.encrypt(shippingAddress2);
    }
    newMember.shipping.city = shippingCity;
    newMember.shipping.stateProv = shippingStateProv;
    newMember.shipping.country = shippingCountry;
    newMember.shipping.zipPostal = shippingZipPostal;
    newMember.shipping.phone = cryptr.encrypt(shippingPhone);
    newMember.shipping.email = shippingEmail;
  }

  await newMember.save();

  return res.status(201).send([{ message: 'Member Registered' }]);
});

// PUT /api/members/:id
router.put('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const { error } = validateUpdateMember(req.body);
  if (error) return res.status(400).send(error.details);
  const {
    name,
    phone,
    address1,
    address2,
    city,
    stateProv,
    country,
    zipPostal,
    timezone,
    timezoneAbbrev,
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

  const updateMember = await Member.findById(req.params.id);
  if (!updateMember)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  updateMember.name = name;
  updateMember.address1 = cryptr.encrypt(address1);
  if (address2) {
    updateMember.address2 = cryptr.encrypt(address2);
  }
  updateMember.city = city;
  updateMember.stateProv = stateProv;
  updateMember.country = country;
  updateMember.zipPostal = zipPostal;
  updateMember.phone = cryptr.encrypt(phone);
  updateMember.timezone = timezone;
  updateMember.timezoneAbbrev = timezoneAbbrev;

  if (shippingSame) {
    updateMember.shipping.name = updateMember.name;
    updateMember.shipping.address1 = cryptr.encrypt(address1);
    if (address2) {
      updateMember.shipping.address2 = cryptr.encrypt(address2);
    }
    updateMember.shipping.city = updateMember.city;
    updateMember.shipping.stateProv = updateMember.stateProv;
    updateMember.shipping.country = updateMember.country;
    updateMember.shipping.zipPostal = updateMember.zipPostal;
    updateMember.shipping.phone = cryptr.encrypt(phone);
    updateMember.shipping.email = updateMember.email;
  } else {
    updateMember.shipping.name = shippingName;
    updateMember.shipping.address1 = cryptr.encrypt(shippingAddress1);
    if (shippingAddress2) {
      updateMember.shipping.address2 = cryptr.encrypt(shippingAddress2);
    }
    updateMember.shipping.city = shippingCity;
    updateMember.shipping.stateProv = shippingStateProv;
    updateMember.shipping.country = shippingCountry;
    updateMember.shipping.zipPostal = shippingZipPostal;
    updateMember.shipping.phone = cryptr.encrypt(shippingPhone);
    updateMember.shipping.email = shippingEmail;
  }

  await updateMember.save();

  return res.status(200).send([{ message: 'Member Updated' }]);
});

// PATCH /api/members/email/:id
router.patch('/email/:id', [validateObjectId, auth], async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error.details);

  const { email } = req.body;

  let member = await Member.findById(req.params.id);
  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  if (member.email === email) {
    return res.status(400).send([{ message: 'Email is identical to what is already set.' }]);
  }

  const emailCheck = await Member.findOne({
    _id: { $ne: req.params.id },
    email
  });

  if (emailCheck) {
    return res
      .status(400)
      .send([{ message: 'Member with the given email address already registered' }]);
  }

  member = await Member.findByIdAndUpdate({ _id: req.params.id }, { email }, { new: true });

  return res.status(200).send([{ message: 'Member email updated' }]);
});

// PATCH /api/v1/members/avatar/:id
router.patch('/avatar/:id', [validateObjectId, auth], async (req, res) => {
  // allow upload of file and reset avatarUrl to relative URL
  res.end();
});

// PATCH /api/v1/members/admin/:id
router.patch('/admin/:id', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(400).send([{ message: 'Member with the given ID not found.' }]);

  member.isAdmin = !member.isAdmin;

  await member.save();

  return res.status(200).send([{ message: 'Member Updated' }]);
});

// PATCH /api/members/password/:id
router.patch('/password/:id', [validateObjectId, auth], async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error.details);

  const { oldpassword, newpassword } = req.body;

  const member = await Member.findById(req.params.id);
  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  const result = await bcrypt.compare(oldpassword, member.password);
  if (!result) return res.status(400).send([{ message: 'Password incorrect.' }]);

  const userEmail = member.email.split('@')[0];

  if (newpassword.includes('password'))
    return res.status(400).send([{ message: "Please do not use 'password' in your password" }]);
  if (newpassword.includes(userEmail))
    return res
      .status(400)
      .send([{ message: 'Please do not use your email username in your password' }]);

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newpassword, salt);

  member.password = hash;
  await member.save();

  return res.status(200).send([{ message: 'Member password updated' }]);
});

// DELETE /api/members/:id
router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.findByIdAndRemove(req.params.id);
  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);
  return res.status(200).send([{ message: 'Member deleted' }]);
});

module.exports = router;
