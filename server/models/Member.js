const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const bcrypt = require('bcryptjs');

const joiOptions = { language: { key: '{{key}} ' } };

const MemberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      uppercase: true,
      trim: true,
    },
    company: {
      type: String,
      uppercase: true,
      trim: true,
    },
    address1: {
      type: String,
      required: true,
      uppercase: true,
    },
    address2: {
      type: String,
      uppercase: true,
    },
    city: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    stateProv: {
      type: String,
      required: true,
      minlength: 2,
      trim: true,
    },
    country: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    zipPostal: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 5,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
        required: true,
      },
    },
    timezone: {
      type: String,
      required: true,
      trim: true,
    },
    billing: {
      name: {
        type: String,
        minlength: 5,
        uppercase: true,
        trim: true,
      },
      company: {
        type: String,
        uppercase: true,
        trim: true,
      },
      address1: {
        type: String,
        uppercase: true,
      },
      address2: {
        type: String,
        uppercase: true,
      },
      city: {
        type: String,
        uppercase: true,
        trim: true,
      },
      stateProv: {
        type: String,
        minlength: 2,
        trim: true,
      },
      country: {
        type: String,
        uppercase: true,
        trim: true,
      },
      zipPostal: {
        type: String,
        uppercase: true,
        minlength: 5,
        trim: true,
      },
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    shipping: {
      name: {
        type: String,
        minlength: 5,
        uppercase: true,
        trim: true,
      },
      company: {
        type: String,
        uppercase: true,
        trim: true,
      },
      address1: {
        type: String,
        uppercase: true,
      },
      address2: {
        type: String,
        uppercase: true,
      },
      city: {
        type: String,
        uppercase: true,
        trim: true,
      },
      stateProv: {
        type: String,
        minlength: 2,
        trim: true,
      },
      country: {
        type: String,
        uppercase: true,
        trim: true,
      },
      zipPostal: {
        type: String,
        uppercase: true,
        minlength: 5,
        trim: true,
      },
      phone: {
        type: String,
      },
      email: {
        type: String,
      },
    },
    notifications: [
      {
        date: {
          type: Date,
          required: true,
        },
        message: {
          type: String,
          required: true,
          trim: true,
        },
        clickTo: {
          type: String,
        },
      },
    ],
    isAdmin: {
      type: Boolean,
      default: false,
    },
    closedAccount: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordTokenExpires: {
      type: Date,
    },
    verificationToken: {
      type: String,
    },
    verificationTokenExpires: {
      type: Date,
    },
  },
  { timestamps: true }
);

function validateLogin(login) {
  const schema = {
    email: Joi.string().trim().required().email(),
    password: Joi.string().required().min(8),
  };

  return Joi.validate(login, schema, joiOptions);
}

function validateNewRegister(member) {
  const schema = {
    password: Joi.string().required().min(8),
    contact: Joi.object({
      name: Joi.string().trim().required().min(5).max(50),
      company: Joi.string().trim().allow('', null),
      address1: Joi.string().trim().required(),
      address2: Joi.string().trim().allow('', null),
      city: Joi.string().trim().required(),
      stateProv: Joi.string().trim().required().min(2),
      country: Joi.string().trim().required().min(2),
      zipPostal: Joi.string().trim().required(),
      phone: Joi.string().trim().required(),
      email: Joi.string().trim().required().email(),
    }),
    billingSame: Joi.boolean(),
    billing: Joi.object({
      name: Joi.string().trim().required().min(5).max(50),
      company: Joi.string().trim().allow('', null),
      address1: Joi.string().trim().required(),
      address2: Joi.string().trim().allow('', null),
      city: Joi.string().trim().required(),
      stateProv: Joi.string().trim().required().min(2),
      country: Joi.string().trim().required().min(2),
      zipPostal: Joi.string().trim().required(),
      phone: Joi.string().trim().required(),
      email: Joi.string().trim().required().email(),
    }),
    shippingSame: Joi.boolean(),
    shipping: Joi.object({
      name: Joi.string().trim().required().min(5).max(50),
      company: Joi.string().trim().allow('', null),
      address1: Joi.string().trim().required(),
      address2: Joi.string().trim().allow('', null),
      city: Joi.string().trim().required(),
      stateProv: Joi.string().trim().required().min(2),
      country: Joi.string().trim().required().min(2),
      zipPostal: Joi.string().trim().required(),
      phone: Joi.string().trim().required(),
      email: Joi.string().trim().required().email(),
    }),
  };

  return Joi.validate(member, schema, joiOptions);
}

function validateNewMember(member) {
  const schema = {
    contact: Joi.object({
      name: Joi.string().trim().required().min(5).max(50),
      company: Joi.string().trim().allow('', null),
      address1: Joi.string().trim().required().min(10),
      address2: Joi.string().trim().allow('', null),
      city: Joi.string().trim().required(),
      stateProv: Joi.string().trim().required().min(2),
      country: Joi.string().trim().required().min(2),
      zipPostal: Joi.string().trim().required(),
      phone: Joi.string().trim().required(),
      email: Joi.string().trim().required().email(),
    }),
    billingSame: Joi.boolean(),
    billing: Joi.object({
      name: Joi.string().trim().required().min(5).max(50),
      company: Joi.string().trim().allow('', null),
      address1: Joi.string().trim().required().min(10),
      address2: Joi.string().trim().allow('', null),
      city: Joi.string().trim().required(),
      stateProv: Joi.string().trim().required().min(2),
      country: Joi.string().trim().required().min(2),
      zipPostal: Joi.string().trim().required(),
      phone: Joi.string().trim().required(),
      email: Joi.string().trim().required().email(),
    }),
    shippingSame: Joi.boolean(),
    shipping: Joi.object({
      name: Joi.string().trim().required().min(5).max(50),
      company: Joi.string().trim().allow('', null),
      address1: Joi.string().trim().min(10).required(),
      address2: Joi.string().trim().allow('', null),
      city: Joi.string().trim().required(),
      stateProv: Joi.string().trim().min(2).required(),
      country: Joi.string().trim().required().min(2),
      zipPostal: Joi.string().trim().required(),
      phone: Joi.string().trim().required(),
      email: Joi.string().trim().required().email(),
    }),
  };

  return Joi.validate(member, schema, joiOptions);
}

function validateUpdateMember(member) {
  const schema = {
    contact: Joi.object({
      name: Joi.string().trim().required().min(5).max(50),
      company: Joi.string().trim().allow('', null),
      address1: Joi.string().trim().required().min(10),
      address2: Joi.string().trim().allow('', null),
      city: Joi.string().trim().required(),
      stateProv: Joi.string().trim().required().min(2),
      country: Joi.string().trim().required().min(2),
      zipPostal: Joi.string().trim().required(),
      phone: Joi.string().trim().required(),
    }),
    billingSame: Joi.boolean().required(),
    billing: Joi.object({
      name: Joi.string().trim().required().min(5).max(50),
      company: Joi.string().trim().allow('', null),
      address1: Joi.string().trim().required().min(10),
      address2: Joi.string().trim().allow('', null),
      city: Joi.string().trim().required(),
      stateProv: Joi.string().trim().required().min(2),
      country: Joi.string().trim().required().min(2),
      zipPostal: Joi.string().trim().required(),
      phone: Joi.string().trim().required(),
      email: Joi.string().trim().required().email(),
    }),
    shippingSame: Joi.boolean().required(),
    shipping: Joi.object({
      name: Joi.string().trim().required().min(5).max(50),
      company: Joi.string().trim().allow('', null),
      address1: Joi.string().trim().required().min(10),
      address2: Joi.string().trim().allow('', null),
      city: Joi.string().trim().required(),
      stateProv: Joi.string().trim().required().min(2),
      country: Joi.string().trim().required().min(2),
      zipPostal: Joi.string().trim().required(),
      phone: Joi.string().trim().required(),
      email: Joi.string().trim().required().email(),
    }),
  };
  return Joi.validate(member, schema, joiOptions);
}

function validateEmail(member) {
  const schema = {
    currentEmail: Joi.string().trim().required().email(),
    newEmail: Joi.string()
      .trim()
      .required()
      .email()
      .invalid(Joi.ref('currentEmail')),
    confirmEmail: Joi.string()
      .trim()
      .required()
      .email()
      .valid(Joi.ref('newEmail'))
      .options({
        language: { any: { allowOnly: 'and newEmail fields must match.' } },
      }),
  };

  return Joi.validate(member, schema, joiOptions);
}

function validateForgotEmail(req) {
  const schema = {
    email: Joi.string().trim().email().required(),
  };

  return Joi.validate(req, schema, joiOptions);
}

function validatePassword(member) {
  const schema = {
    oldPassword: Joi.string().required().min(8),
    newPassword: Joi.string().required().min(8).invalid(Joi.ref('oldPassword')),
    confirmPassword: Joi.string()
      .required()
      .min(8)
      .valid(Joi.ref('newPassword'))
      .options({
        language: { any: { allowOnly: 'and newpassword fields must match.' } },
      }),
  };

  return Joi.validate(member, schema, joiOptions);
}

function validatePasswordReset(req) {
  const schema = {
    password: Joi.string().required(),
    confirmPassword: Joi.string()
      .required()
      .valid(Joi.ref('password'))
      .options({ language: { any: { allowOnly: 'Must match password' } } }),
  };

  return Joi.validate(req, schema, joiOptions);
}

function validateNotification(notification) {
  const schema = {
    recipients: Joi.array().required().items(Joi.objectId().required()),
    message: Joi.string().trim().required(),
    clickTo: Joi.string().trim().allow('', null),
  };

  return Joi.validate(notification, schema, joiOptions);
}

MemberSchema.pre('save', async function (next) {
  if (this.isNew) {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
      next();
    } catch (err) {
      next(err);
    }
  }
});

exports.Member = mongoose.model('members', MemberSchema);
exports.validateNewRegister = validateNewRegister;
exports.validateNewMember = validateNewMember;
exports.validateUpdateMember = validateUpdateMember;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateNotification = validateNotification;
exports.validateLogin = validateLogin;
exports.validateForgotEmail = validateForgotEmail;
exports.validatePasswordReset = validatePasswordReset;
