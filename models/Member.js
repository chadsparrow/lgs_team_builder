const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const config = require('config');
const jwt = require('jsonwebtoken');

const joiOptions = { language: { key: '{{key}} ' } };

const MemberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
      uppercase: true,
      trim: true
    },
    address1: {
      type: String,
      required: true
    },
    address2: {
      type: String
    },
    city: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    stateProv: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 2,
      trim: true
    },
    country: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    zipPostal: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 5,
      trim: true
    },
    phone: {
      type: String,
      required: true
    },
    timezone: {
      type: String,
      trim: true
    },
    shipping: {
      name: {
        type: String,
        minlength: 5,
        uppercase: true,
        trim: true
      },
      address1: {
        type: String
      },
      address2: {
        type: String
      },
      city: {
        type: String,
        uppercase: true,
        trim: true
      },
      stateProv: {
        type: String,
        uppercase: true,
        minlength: 2,
        trim: true
      },
      country: {
        type: String,
        uppercase: true,
        trim: true
      },
      zipPostal: {
        type: String,
        uppercase: true,
        minlength: 5,
        trim: true
      },
      phone: {
        type: String
      },
      email: {
        type: String
      }
    },
    avatarUrl: {
      type: String,
      default: null,
      trim: true
    },
    notifications: [
      {
        date: {
          type: Date,
          required: true
        },
        message: {
          type: String,
          required: true,
          trim: true
        },
        clickTo: {
          type: String
        }
      }
    ],
    isAdmin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

function validateNewMember(member) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required()
      .trim(),
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
      .trim(),
    address1: Joi.string()
      .min(10)
      .required()
      .trim(),
    address2: Joi.string()
      .trim()
      .allow('', null),
    city: Joi.string()
      .required()
      .trim(),
    stateProv: Joi.string()
      .min(2)
      .required()
      .trim(),
    country: Joi.string()
      .min(2)
      .required()
      .trim(),
    zipPostal: Joi.string()
      .required()
      .trim(),
    phone: Joi.string()
      .trim()
      .regex(/^[0-9]{7,10}$/)
      .required(),
    timezone: Joi.string()
      .required()
      .trim(),
    shippingName: Joi.string()
      .required()
      .trim(),
    shippingAddress1: Joi.string()
      .required()
      .trim(),
    shippingAddress2: Joi.string().trim(),
    shippingCity: Joi.string()
      .required()
      .trim(),
    shippingStateProv: Joi.string()
      .required()
      .trim(),
    shippingCountry: Joi.string()
      .required()
      .trim(),
    shippingZipPostal: Joi.string()
      .required()
      .trim(),
    shippingPhone: Joi.string()
      .required()
      .trim(),
    shippingEmail: Joi.string()
      .required()
      .email()
  };

  return Joi.validate(member, schema, joiOptions);
}

function validateUpdateMember(member) {
  const schema = {
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
      .trim(),
    address1: Joi.string()
      .min(10)
      .required()
      .trim(),
    address2: Joi.string()
      .trim()
      .allow('', null),
    city: Joi.string()
      .required()
      .trim(),
    stateProv: Joi.string()
      .min(2)
      .required()
      .trim(),
    country: Joi.string()
      .min(2)
      .required()
      .trim(),
    zipPostal: Joi.string()
      .required()
      .trim(),
    phone: Joi.string()
      .regex(/^[0-9]{7,10}$/)
      .required()
      .trim(),
    shippingSame: Joi.boolean().required(),
    shippingName: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('name'),
      otherwise: Joi.string()
        .min(5)
        .max(50)
        .required()
        .trim()
    }),
    shippingAddress1: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('address1'),
      otherwise: Joi.string()
        .min(10)
        .required()
        .trim()
    }),
    shippingAddress2: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('address2'),
      otherwise: Joi.string()
        .trim()
        .allow('', null)
    }),
    shippingCity: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('city'),
      otherwise: Joi.string()
        .required()
        .trim()
    }),
    shippingStateProv: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('stateProv'),
      otherwise: Joi.string()
        .min(2)
        .required()
        .trim()
    }),
    shippingCountry: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('country'),
      otherwise: Joi.string()
        .min(2)
        .required()
        .trim()
    }),
    shippingZipPostal: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('zipPostal'),
      otherwise: Joi.string()
        .required()
        .trim()
    }),
    shippingPhone: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('phone'),
      otherwise: Joi.string()
        .trim()
        .regex(/^[0-9]{7,10}$/)
        .required()
    }),
    shippingEmail: Joi.when('shippingSame', {
      is: true,
      then: Joi.string()
        .trim()
        .allow('', null)
        .email(),
      otherwise: Joi.string()
        .trim()
        .email()
        .required()
    }),
    isAdmin: Joi.boolean()
  };
  return Joi.validate(member, schema, joiOptions);
}

function validateEmail(member) {
  const schema = {
    email: Joi.string()
      .email()
      .required()
  };

  return Joi.validate(member, schema, joiOptions);
}

function validatePassword(member) {
  const schema = {
    oldpassword: Joi.string()
      .min(8)
      .required(),
    newPassword: Joi.string()
      .disallow(Joi.ref('oldpassword'))
      .min(8)
      .required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newpassword'))
      .required()
      .options({ language: { any: { allowOnly: 'and newpassword fields must match.' } } })
  };

  return Joi.validate(member, schema, joiOptions);
}

function validateNotification(notification) {
  const schema = {
    recipients: Joi.array()
      .required()
      .items(Joi.objectId().required()),
    message: Joi.string().required(),
    clickTo: Joi.string().allow('', null)
  };

  return Joi.validate(notification, schema, joiOptions);
}

// eslint-disable-next-line func-names
MemberSchema.methods.generateAuthToken = function() {
  const signOptions = {
    expiresIn: '5m' // *******    change to '8h' for production
  };
  // eslint-disable-next-line no-underscore-dangle
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'), signOptions);
  return token;
};

exports.Member = mongoose.model('members', MemberSchema);
exports.validateNewMember = validateNewMember;
exports.validateUpdateMember = validateUpdateMember;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateNotification = validateNotification;
