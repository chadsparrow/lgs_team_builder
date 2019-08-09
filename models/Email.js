const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const joi_options = { abortEarly: false, language: { key: '{{key}} ' } };

const EmailSchema = new mongoose.Schema(
  {
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    recipients: [
      {
        member_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'members'
        },
        unread: {
          type: Boolean,
          default: true
        },
        archived: {
          type: Boolean,
          default: false
        }
      }
    ],
    subject: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255
    },
    messages: [
      {
        message: {
          type: String,
          required: true
        },
        date: {
          type: Date,
          required: true
        },
        sender_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'members'
        }
      }
    ],
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teams'
    }
  },
  { timestamps: true }
);

function validateEmail(email) {
  const schema = {
    recipients: Joi.array()
      .required()
      .items(Joi.objectId().required()),
    subject: Joi.string()
      .required()
      .trim(),
    message: Joi.string().required(),
    team_id: Joi.objectId()

    // TODO - make team required once we add a team
  };
  return Joi.validate(email, schema, joi_options);
}

function validateMessage(message) {
  const schema = {
    message: Joi.string().required()
  };
  return Joi.validate(message, schema, joi_options);
}

exports.Email = mongoose.model('emails', EmailSchema);
exports.validateEmail = validateEmail;
exports.validateMessage = validateMessage;
