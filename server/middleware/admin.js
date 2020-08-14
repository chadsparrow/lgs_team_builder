const createError = require('http-errors');

module.exports = function (req, res, next) {
  try {
    if (!req.member.isAdmin) throw createError(403, 'Access Denied');
    next();
  } catch (err) {
    next(err);
  }
};
