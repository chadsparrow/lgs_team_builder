const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const StoreSchema = new mongoose.Schema(
  {
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    }
  },
  { timestamps: true }
);

function validateEmail(email) {
  const schema = {
    recipients: Joi.array()
      .required()
      .items(Joi.objectId().required()),
    subject: Joi.string().required(),
    message: Joi.string().required()
  };
  return Joi.validate(email, schema);
}

exports.Store = mongoose.model('stores', StoreSchema);
