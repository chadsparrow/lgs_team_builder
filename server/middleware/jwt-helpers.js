const jwt = require('jsonwebtoken');
const logger = require('../middleware/logger');
const createError = require('http-errors');
const { Member } = require('../models/Member');

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const signOptions = {
        expiresIn: '15m',
        issuer: 'LGS TeamBuilder',
        audience: userId.toString(),
      };

      jwt.sign({}, process.env.JWT_PRIVATE_KEY, signOptions, (err, token) => {
        if (err) {
          logger.error(err);
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },
  verifyAccessToken: (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_PRIVATE_KEY, (err, decoded) => {
        if (err) {
          const message =
            err.name === 'JsonWebTokenError'
              ? 'Access Denied. Invalid Token'
              : 'Access Token Expired';

          reject(createError(401, message));
        }

        resolve(decoded);
      });
    });
  },
  signRefreshToken: () => {},
  verifyRefreshToken: () => {},
};
