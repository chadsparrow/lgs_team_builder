const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');

const { Member } = require('../models/Member');
const { Admin } = require('../models/Admin');

// POST /api/members
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  const admin = await Admin.findOne({ email: req.body.email });
  const member = await Member.findOne({ email: req.body.email });
  if (!member && !admin) return res.status(401).send({ msg: 'Invalid email or password.' });

  if (admin) {
    const validPassword = await bcrypt.compare(req.body.password, admin.password);
    if (!validPassword) return res.status(401).send({ msg: 'Invalid email or password' });
    const token = admin.generateAuthToken();
    return res.send(token);
  }

  const validPassword = await bcrypt.compare(req.body.password, member.password);
  if (!validPassword) return res.status(401).send({ msg: 'Invalid email or password' });
  const token = member.generateAuthToken();
  res.send(token);
});

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

  return Joi.validate(req, schema);
}

module.exports = router;
