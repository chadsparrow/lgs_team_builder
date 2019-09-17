/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const _ = require('lodash');
const express = require('express');
const generator = require('generate-password');

const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { Team } = require('../models/Team');

const {
  Member,
  validateNewMember,
  validateUpdateMember,
  validateEmail,
  validatePassword
} = require('../models/Member');

// GET /api/v1/members
router.get('/', [auth, admin], async (req, res) => {
  const members = await Member.find({ _id: { $ne: req.member._id } })
    .select('_id name email isAdmin')
    .sort({ name: 1 });

  if (members && members.length === 0)
    return res.status(404).send([{ message: 'There are no members in the database.' }]);

  return res.send(members);
});

router.get('/admins', auth, async (req, res) => {
  const admins = await Member.find({ isAdmin: true }).select('_id name email');
  return res.status(200).send(admins);
});

// GET /api/v1/members/:id
router.get('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  return res.send(
    _.pick(member, ['_id', 'name', 'email', 'createdAt', 'avatarUrl', 'timezone', 'isAdmin'])
  );
});

// GET /api/v1/members/:id/details
router.get('/:id/details', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.findById(req.params.id).select(
    '-__v -updatedAt -password -notifications'
  );

  const teams = await Team.find({ members: req.params.id }).select('name _id');

  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  return res.send({ member, teams });
});

router.get('/:id/me', [validateObjectId, auth], async (req, res) => {
  const me = await Member.findOne({ _id: req.params.id }).select('-__v -updatedAt');
  return res.status(200).send(me);
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
    shippingEmail,
    billingSame,
    billingName,
    billingAddress1,
    billingAddress2,
    billingCity,
    billingStateProv,
    billingCountry,
    billingZipPostal,
    billingPhone,
    billingEmail
  } = req.body;

  const member = await Member.findOne({ email });
  if (member) return res.status(400).send([{ message: 'Member already registered.' }]);

  const newMember = new Member({
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
    isAdmin: false
  });

  newMember.notifications.push({ date: new Date(), message: 'Welcome to Team Builder!' });
  const password = generator.generate({ length: 10, numbers: true });
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
    newMember.shipping.address1 = shippingAddress1;
    newMember.shipping.address2 = shippingAddress2;
    newMember.shipping.city = shippingCity;
    newMember.shipping.stateProv = shippingStateProv;
    newMember.shipping.country = shippingCountry;
    newMember.shipping.zipPostal = shippingZipPostal;
    newMember.shipping.phone = shippingPhone;
    newMember.shipping.email = shippingEmail;
  }

  if (billingSame) {
    newMember.billing.name = newMember.name;
    newMember.billing.address1 = newMember.address1;
    newMember.billing.address2 = newMember.address2;
    newMember.billing.city = newMember.city;
    newMember.billing.stateProv = newMember.stateProv;
    newMember.billing.country = newMember.country;
    newMember.billing.zipPostal = newMember.zipPostal;
    newMember.billing.phone = newMember.phone;
    newMember.billing.email = newMember.email;
  } else {
    newMember.billing.name = billingName;
    newMember.billing.address1 = billingAddress1;
    newMember.billing.address2 = billingAddress2;
    newMember.billing.city = billingCity;
    newMember.billing.stateProv = billingStateProv;
    newMember.billing.country = billingCountry;
    newMember.billing.zipPostal = billingZipPostal;
    newMember.billing.phone = billingPhone;
    newMember.billing.email = billingEmail;
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
    shippingEmail,
    billingSame,
    billingName,
    billingAddress1,
    billingAddress2,
    billingCity,
    billingStateProv,
    billingCountry,
    billingZipPostal,
    billingPhone,
    billingEmail
  } = req.body;

  const updateMember = await Member.findById(req.params.id);
  if (!updateMember)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  updateMember.name = name;
  updateMember.address1 = address1;
  updateMember.address2 = address2;
  updateMember.city = city;
  updateMember.stateProv = stateProv;
  updateMember.country = country;
  updateMember.zipPostal = zipPostal;
  updateMember.phone = phone;
  updateMember.timezone = timezone;
  updateMember.timezoneAbbrev = timezoneAbbrev;

  if (shippingSame) {
    updateMember.shipping.name = updateMember.name;
    updateMember.shipping.address1 = address1;
    updateMember.shipping.address2 = address2;
    updateMember.shipping.city = updateMember.city;
    updateMember.shipping.stateProv = updateMember.stateProv;
    updateMember.shipping.country = updateMember.country;
    updateMember.shipping.zipPostal = updateMember.zipPostal;
    updateMember.shipping.phone = updateMember.phone; // DOUBLE CHECK THIS WORKS
    updateMember.shipping.email = updateMember.email;
  } else {
    updateMember.shipping.name = shippingName;
    updateMember.shipping.address1 = shippingAddress1;
    updateMember.shipping.address2 = shippingAddress2;
    updateMember.shipping.city = shippingCity;
    updateMember.shipping.stateProv = shippingStateProv;
    updateMember.shipping.country = shippingCountry;
    updateMember.shipping.zipPostal = shippingZipPostal;
    updateMember.shipping.phone = shippingPhone;
    updateMember.shipping.email = shippingEmail;
  }

  if (billingSame) {
    updateMember.billing.name = updateMember.name;
    updateMember.billing.address1 = address1;
    updateMember.billing.address2 = address2;
    updateMember.billing.city = updateMember.city;
    updateMember.billing.stateProv = updateMember.stateProv;
    updateMember.billing.country = updateMember.country;
    updateMember.billing.zipPostal = updateMember.zipPostal;
    updateMember.billing.phone = updateMember.phone; // DOUBLE CHECK THIS WORKS
    updateMember.billing.email = updateMember.email;
  } else {
    updateMember.billing.name = billingName;
    updateMember.billing.address1 = billingAddress1;
    updateMember.billing.address2 = billingAddress2;
    updateMember.billing.city = billingCity;
    updateMember.billing.stateProv = billingStateProv;
    updateMember.billing.country = billingCountry;
    updateMember.billing.zipPostal = billingZipPostal;
    updateMember.billing.phone = billingPhone;
    updateMember.billing.email = billingEmail;
  }

  await updateMember.save();

  const updateMemberMainContact = {
    name: updateMember.name,
    address1: updateMember.address1,
    address2: updateMember.address2,
    city: updateMember.city,
    stateProv: updateMember.stateProv,
    country: updateMember.country,
    zipPostal: updateMember.zipPostal,
    phone: updateMember.phone,
    email: updateMember.email
  };

  const teamsToUpdate = await Team.find({
    $or: [{ 'mainContact.email': updateMember.email }, { 'bulkShipping.email': updateMember.email }]
  });

  if (teamsToUpdate && teamsToUpdate.length > 0) {
    teamsToUpdate.forEach(async team => {
      if (team.mainContact.email === updateMember.email) {
        await Team.updateOne({ _id: team._id }, { $set: { mainContact: updateMemberMainContact } });
      }

      if (team.bulkShipping.email === updateMember.email) {
        await Team.updateOne({ _id: team._id }, { $set: { bulkShipping: updateMember.shipping } });
      }
    });
  }

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
