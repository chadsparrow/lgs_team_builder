/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable func-names */
const jwt = require('jsonwebtoken');
const config = require('config');
const { Member } = require('../models/Member');

module.exports = async function(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send([{ message: 'Access Denied. No token provided.' }]);

  const tokenArray = token.split(' ');

  try {
    req.member = jwt.verify(tokenArray[1], config.get('jwtPrivateKey'));
    const member = await Member.findById(req.member._id);
    if (!member) return res.status(400).send([{ message: 'Invalid User ID' }]);
    req.member.isAdmin = member.isAdmin;
    next();
  } catch (err) {
    res.status(400).send([{ message: 'Access Denied. Invalid token.' }]);
  }
};
