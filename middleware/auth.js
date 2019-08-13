/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
const jwt = require('jsonwebtoken');
const config = require('config');
const { Member } = require('../models/Member');

module.exports = async function(req, res, next) {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ message: 'Access Denied. No token provided.' });

  try {
    req.member = jwt.verify(token, config.get('jwtPrivateKey'));
    const member = await Member.findById(req.member._id);
    if (!member) return res.status(400).json({ message: 'Invalid User ID' });
    next();
  } catch (err) {
    res.status(400).json({ message: 'Access Denied. Invalid token.' });
  }
};
