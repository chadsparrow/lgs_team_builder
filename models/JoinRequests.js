const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const JoinRequestSchema = new mongoose.Schema(
  {
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teams'
    }
  },
  { timestamps: true }
);

function validateJoinRequest(request) {
  const schema = {
    member_id: Joi.objectId().required(),
    team_id: Joi.objectId().required()
  };

  return Joi.validate(request, schema);
}

exports.JoinRequest = mongoose.model('joinrequests', JoinRequestSchema);
exports.validateJoinRequest = validateJoinRequest;
