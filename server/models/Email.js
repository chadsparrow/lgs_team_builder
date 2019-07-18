const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const EmailSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "members"
    },
    recipients: [
      {
        _id: false,
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "members"
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
        sentBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "members"
        }
      }
    ]
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

function validateMessage(message) {
  const schema = {
    message: Joi.string().required()
  };
  return Joi.validate(message, schema);
}

exports.Email = mongoose.model("emails", EmailSchema);
exports.validateEmail = validateEmail;
exports.validateMessage = validateMessage;
