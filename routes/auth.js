/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');

const router = express.Router();
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const cryptr = require('../middleware/cryptr');
const { Member, validateNewRegister } = require('../models/Member');
const { Email } = require('../models/Email');

const joiOptions = { abortEarly: false, language: { key: '{{key}} ' } };

function validate(req) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required()
      .trim(false)
  };
  return Joi.validate(req, schema, joiOptions);
}

// POST /api/members
router.post('/login', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details);

  const member = await Member.findOne({ email: req.body.email });
  if (!member) return res.status(400).send([{ message: 'Invalid email or password.' }]);

  const validPassword = await bcrypt.compare(req.body.password, member.password);
  if (!validPassword) return res.status(400).send([{ message: 'Invalid email or password' }]);

  const token = member.generateAuthToken();

  const emails = await Email.find({
    $or: [
      { recipients: { $elemMatch: { memberId: mongoose.Types.ObjectId(member._id) } } },
      { messages: { $elemMatch: { senderId: mongoose.Types.ObjectId(member._id) } } }
    ]
  })
    .populate({ path: 'senderId', select: 'name email' })
    .populate({ path: 'recipients.memberId', select: 'name email' })
    .populate({ path: 'messages.senderId', select: 'name email' })
    .sort('-messages.date');

  return res.send([
    {
      token,
      member: _.pick(member, [
        '_id',
        'email',
        'name',
        'isAdmin',
        'timezone',
        'timezoneAbbrev',
        'avatarUrl',
        'createdAt'
      ]),
      message: 'Welcome Back!',
      emails
    }
  ]);
});

// POST /api/members
router.post('/register', async (req, res) => {
  const { error } = validateNewRegister(req.body);
  if (error) return res.status(400).send(error.details);

  const {
    email,
    password,
    name,
    address1,
    address2,
    city,
    stateProv,
    country,
    zipPostal,
    phone,
    timezone,
    timezoneAbbrev,
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
    return res.status(400).send([{ message: "Please do not use 'password' in your password" }]);
  if (password.includes(userEmail))
    return res
      .status(400)
      .send([{ message: 'Please do not use your email username in your password' }]);

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

  newMember.notifications.push({ date: new Date(), message: 'Welcome to Team Builder!' });

  const salt = await bcrypt.genSalt(10);
  newMember.password = await bcrypt.hash(password, salt);

  await newMember.save();

  return res.send([{ message: 'You are now registered!' }]);
});

module.exports = router;
