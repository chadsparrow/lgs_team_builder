const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const joiOptions = { abortEarly: true, language: { key: '{{key}} ' } };

const JoinRequestSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teams'
    }
  },
  { timestamps: true }
);

function validateJoinRequest(request) {
  const schema = {
    memberId: Joi.objectId().required(),
    teamId: Joi.objectId().required()
  };

  return Joi.validate(request, schema, joiOptions);
}

exports.JoinRequest = mongoose.model('joinrequests', JoinRequestSchema);
exports.validateJoinRequest = validateJoinRequest;
