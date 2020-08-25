const { Member } = require('../models/Member');
const createError = require('http-errors');
const { verifyAccessToken } = require('../middleware/jwt-helpers');

module.exports = async (req, res, next) => {
  try {
    const accessToken = req.cookies['tb_access_token'];

    const refreshToken = req.cookies['tb_refresh_token'];

    /* if access Token is not valid but refreshToken is valid re-sign 
    access token and refresh token and send back to client */

    //otherwise send 401 - Unauthorized Error
    if (!accessToken && !refreshToken)
      throw createError(401, 'Access Denied. No token provided');

    const decoded = await verifyAccessToken(accessToken);
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
