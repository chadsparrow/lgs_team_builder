const { Member } = require('../models/Member');
const createError = require('http-errors');
const { verifyAccessToken } = require('../middleware/jwt-helpers');

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.header('Authorization');
    if (!bearerToken)
      throw createError(401, 'Access Denied. No token provided');

    const token = bearerToken.split(' ')[1];

    const decoded = await verifyAccessToken(token);
    req.member = decoded;

    const member = await Member.findById(req.member.aud);
    if (!member) throw createError(401, 'Invalid User ID');

    req.member.isAdmin = member.isAdmin;
    req.member._id = member._id;

    next();
  } catch (err) {
    next(err);
  }
};
