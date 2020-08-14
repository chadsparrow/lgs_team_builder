const jwt = require('jsonwebtoken');
const { Member } = require('../models/Member');
const createError = require('http-errors');

module.exports = function (req, res, next) {
  try {
    const bearerToken = req.header('Authorization');
    if (!bearerToken)
      throw createError(401, 'Access Denied. No token provided');

    const token = bearerToken.split(' ')[1];

    jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
      if (err) {
        const message =
          err.name === 'JsonWebTokenError'
            ? 'Access Denied. Invalid Token'
            : 'Access Token Expired';

        throw createError(401, message);
      }

      req.member = decoded;

      const member = await Member.findById(req.member.aud);
      if (!member) throw createError(401, 'Invalid User ID');

      req.member.isAdmin = member.isAdmin;
      req.member._id = member._id;

      next();
    });
  } catch (err) {
    next(err);
  }
};
