const jwt = require('jsonwebtoken');
const logger = require('../middleware/logger');
const createError = require('http-errors');

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const signOptions = {
        expiresIn: '1h',
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
  verifyAccessToken: () => {},
  signRefreshToken: () => {},
  verifyRefreshToken: () => {},
};
