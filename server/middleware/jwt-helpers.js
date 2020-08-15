const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const { Member } = require('../models/Member');
const config = require('../config/config');

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const signOptions = {
        expiresIn: config.ACCESS_TOKEN_TTL,
        issuer: 'LGS TeamBuilder',
        audience: userId.toString(),
      };

      jwt.sign(
        {},
        process.env.ACCESS_TOKEN_SECRET,
        signOptions,
        (err, token) => {
          if (err) {
            reject(createError.InternalServerError());
          }
          resolve(token);
        }
      );
    });
  },
  verifyAccessToken: (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
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
  signRefreshToken: (userId) => {
    return new Promise((resolve, reject) => {
      const signOptions = {
        expiresIn: config.REFRESH_TOKEN_TTL,
        issuer: 'LGS TeamBuilder',
        audience: userId.toString(),
      };

      jwt.sign(
        {},
        process.env.REFRESH_TOKEN_SECRET,
        signOptions,
        (err, token) => {
          if (err) {
            reject(createError.InternalServerError());
          }
          resolve(token);
        }
      );
    });
  },
  verifyRefreshToken: () => {},
};
