/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');
const _ = require('lodash');

const router = express.Router();
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const { Member, validateNewRegister } = require('../models/Member');
const { Email } = require('../models/Email');
const { Team } = require('../models/Team');

const validateObjectId = require('../middleware/validateObjectId');

const joiOptions = { abortEarly: false, language: { key: '{{key}} ' } };

function validateLogin(req) {
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

// @desc    Member login
// @route   POST /api/v1/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { error } = validateLogin(req.body);
  if (error) return res.status(400).send(error.details);

  // checks if user with email exists
  const member = await Member.findOne({ email: req.body.email });
  if (!member) return res.status(400).send([{ message: 'Invalid email or password.' }]);

  // compares input password with db password
  const validPassword = await bcrypt.compare(req.body.password, member.password);
  if (!validPassword) return res.status(400).send([{ message: 'Invalid email or password' }]);

  // checks if account is closed
  if (member.closedAccount)
    return res.status(401).send([
      {
        message: 'Your account is currently deactivated, contact your Admin/Manager to reactivate'
      }
    ]);

  // generates an JSONWebToken once authenticated
  const token = member.generateAuthToken();

  // gathers emails for current member - currently not being used on front-end, may delete
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
      member: _.pick(member, ['_id', 'email', 'name', 'isAdmin', 'timezone', 'createdAt']),
      message: 'Welcome Back!',
      emails
    }
  ]);
});

// @desc    Member Register
// @route   POST /api/v1/auth/register
// @access  Public
router.post('/register/:id', validateObjectId, async (req, res) => {
  const { error } = validateNewRegister(req.body.member);
  if (error) return res.status(400).send(error.details);

  const team = await Team.findById(req.params.id);
  if (!team) return res.status(400).send([{ message: 'Team with the given ID not found' }]);

  const {
    email,
    password,
    name,
    company,
    address1,
    address2,
    city,
    stateProv,
    country,
    zipPostal,
    phone,
    shippingSame,
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
    billingSame,
    billingName,
    billingCompany,
    billingAddress1,
    billingAddress2,
    billingCity,
    billingStateProv,
    billingCountry,
    billingZipPostal,
    billingPhone,
    billingEmail
  } = req.body;

  // checks if the word "password" or email address is in their password and denies creation
  const userEmail = email.split('@')[0];
  if (password.includes('password'))
    return res.status(400).send([{ message: "Please do not use 'password' in your password" }]);
  if (password.includes(userEmail))
    return res
      .status(400)
      .send([{ message: 'Please do not use your email username in your password' }]);

  // checks if email already registered
  const member = await Member.findOne({ email });
  if (member) return res.status(400).send([{ message: 'Member already registered.' }]);

  const newMember = new Member({
    name,
    company,
    address1,
    address2,
    city,
    stateProv,
    country,
    zipPostal,
    phone,
    email,
    isAdmin: false
  });

  if (shippingSame) {
    newMember.shipping.name = name;
    newMember.shipping.company = company;
    newMember.shipping.address1 = address1;
    newMember.shipping.address2 = address2;
    newMember.shipping.city = city;
    newMember.shipping.stateProv = stateProv;
    newMember.shipping.country = country;
    newMember.shipping.zipPostal = zipPostal;
    newMember.shipping.phone = phone;
    newMember.shipping.email = email;
  } else {
    newMember.shipping.name = shippingName;
    newMember.shipping.company = shippingCompany;
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
    newMember.billing.name = name;
    newMember.billing.company = company;
    newMember.billing.address1 = address1;
    newMember.billing.address2 = address2;
    newMember.billing.city = city;
    newMember.billing.stateProv = stateProv;
    newMember.billing.country = country;
    newMember.billing.zipPostal = zipPostal;
    newMember.billing.phone = phone;
    newMember.billing.email = email;
  } else {
    newMember.billing.name = billingName;
    newMember.billing.company = billingCompany;
    newMember.billing.address1 = billingAddress1;
    newMember.billing.address2 = billingAddress2;
    newMember.billing.city = billingCity;
    newMember.billing.stateProv = billingStateProv;
    newMember.billing.country = billingCountry;
    newMember.billing.zipPostal = billingZipPostal;
    newMember.billing.phone = billingPhone;
    newMember.billing.email = billingEmail;
  }

  const salt = await bcrypt.genSalt(10);
  newMember.password = await bcrypt.hash(password, salt);

  await newMember.save();

  return res.send([{ message: 'You are now registered!' }]);
});

module.exports = router;
