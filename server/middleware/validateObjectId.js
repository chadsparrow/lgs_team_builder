const mongoose = require('mongoose');
const createError = require('http-errors');

module.exports = function (req, res, next) {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      throw createError(400, 'Invalid ID');

    next();
  } catch (err) {
    next(err);
  }
};
