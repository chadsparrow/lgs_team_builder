const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const joiOptions = { abortEarly: false, language: { key: '{{key}} ' } };

const EmailSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    recipients: [
      {
        memberId: {
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
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'members'
        }
      }
    ],
    teamId: {
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
    teamId: Joi.objectId()
  };
  return Joi.validate(email, schema, joiOptions);
}

function validateMessage(message) {
  const schema = {
    message: Joi.string().required()
  };
  return Joi.validate(message, schema, joiOptions);
}

exports.Email = mongoose.model('emails', EmailSchema);
exports.validateEmail = validateEmail;
exports.validateMessage = validateMessage;
