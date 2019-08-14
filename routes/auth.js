const express = require('express');

const router = express.Router();
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const _ = require('lodash');
const cryptr = require('../middleware/cryptr');
const { Member, validateNewMember } = require('../models/Member');

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
  if (error) return res.status(400).json(error.details);

  const member = await Member.findOne({ email: req.body.email });
  if (!member) return res.status(401).json({ message: 'Invalid email or password.' });

  const validPassword = await bcrypt.compare(req.body.password, member.password);
  if (!validPassword) return res.status(401).json({ message: 'Invalid email or password' });

  const token = member.generateAuthToken();
  return res.send({ token, member: _.pick(member, ['_id', 'email', 'isAdmin']) });
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
    email,
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
    newMember.shipping.email = shippingEmail;
  }

  await newMember.save();

  return res.json(_.pick(newMember, ['_id', 'name', 'email']));
});

module.exports = router;
