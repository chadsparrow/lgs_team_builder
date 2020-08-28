const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const config = require('../config/config');
const fs = require('fs');
const path = require('path');
const privateKey = fs.readFileSync(
  path.join(__dirname, '../config/private_key.pem'),
  'utf8'
);

module.exports = {
  signAccessToken: (userId) => {
    return new Promise((resolve, reject) => {
      const signOptions = {
        expiresIn: config.ACCESS_TOKEN_TTL,
        issuer: 'LGS TeamBuilder',
        audience: userId.toString(),
        algorithm: 'RS256',
      };

      jwt.sign({}, privateKey, signOptions, (err, token) => {
        if (err) {
          reject(createError.InternalServerError());
        }
        resolve(token);
      });
    });
  },

  verifyAccessToken: (token) => {
    const verifyOptions = {
      issuer: 'LGS TeamBuilder',
      algorithms: ['RS256'],
    };
    return new Promise((resolve, reject) => {
      jwt.verify(token, privateKey, verifyOptions, (err, decoded) => {
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
  verifyRefreshToken: (rtoken) => {
    return new Promise((resolve, reject) => {
      jwt.verify(rtoken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
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
};
