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
    company: {
      type: String,
      uppercase: true,
      trim: true
    },
    address1: {
      type: String,
      required: true,
      uppercase: true
    },
    address2: {
      type: String,
      uppercase: true
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
    timezoneAbbrev: {
      type: String,
      required: true
    },
    billing: {
      name: {
        type: String,
        minlength: 5,
        uppercase: true,
        trim: true
      },
      company: {
        type: String,
        uppercase: true,
        trim: true
      },
      address1: {
        type: String,
        uppercase: true
      },
      address2: {
        type: String,
        uppercase: true
      },
      city: {
        type: String,
        uppercase: true,
        trim: true
      },
      stateProv: {
        type: String,
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
    shipping: {
      name: {
        type: String,
        minlength: 5,
        uppercase: true,
        trim: true
      },
      company: {
        type: String,
        uppercase: true,
        trim: true
      },
      address1: {
        type: String,
        uppercase: true
      },
      address2: {
        type: String,
        uppercase: true
      },
      city: {
        type: String,
        uppercase: true,
        trim: true
      },
      stateProv: {
        type: String,
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
    },
    closedAccount: {
      type: Boolean,
      default: false
    },
    isVerified: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

function validateNewRegister(member) {
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
    company: Joi.string().allow('', null),
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
      .required(),
    timezone: Joi.string().trim(),
    timezoneAbbrev: Joi.string().trim(),
    shippingSame: Joi.boolean(),
    shippingName: Joi.string()
      .required()
      .trim(),
    shippingCompany: Joi.string().allow('', null),
    shippingAddress1: Joi.string()
      .required()
      .trim(),
    shippingAddress2: Joi.string()
      .allow('', null)
      .trim(),
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
      .email(),
    billingSame: Joi.boolean(),
    billingName: Joi.string()
      .required()
      .trim(),
    billingCompany: Joi.string().allow('', null),
    billingAddress1: Joi.string()
      .required()
      .trim(),
    billingAddress2: Joi.string()
      .allow('', null)
      .trim(),
    billingCity: Joi.string()
      .required()
      .trim(),
    billingStateProv: Joi.string()
      .required()
      .trim(),
    billingCountry: Joi.string()
      .required()
      .trim(),
    billingZipPostal: Joi.string()
      .required()
      .trim(),
    billingPhone: Joi.string()
      .required()
      .trim(),
    billingEmail: Joi.string()
      .required()
      .email()
  };

  return Joi.validate(member, schema, joiOptions);
}
function validateNewMember(member) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    name: Joi.string()
      .min(5)
      .max(50)
      .required()
      .trim(),
    company: Joi.string().allow('', null),
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
      .required(),
    timezone: Joi.string()
      .allow('', null)
      .trim(),
    timezoneAbbrev: Joi.string()
      .allow('', null)
      .trim(),
    shippingSame: Joi.boolean(),
    shippingName: Joi.string()
      .required()
      .trim(),
    shippingCompany: Joi.string().allow('', null),
    shippingAddress1: Joi.string()
      .required()
      .trim(),
    shippingAddress2: Joi.string()
      .allow('', null)
      .trim(),
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
      .email(),
    billingSame: Joi.boolean(),
    billingName: Joi.string()
      .required()
      .trim(),
    billingCompany: Joi.string().allow('', null),
    billingAddress1: Joi.string()
      .required()
      .trim(),
    billingAddress2: Joi.string()
      .allow('', null)
      .trim(),
    billingCity: Joi.string()
      .required()
      .trim(),
    billingStateProv: Joi.string()
      .required()
      .trim(),
    billingCountry: Joi.string()
      .required()
      .trim(),
    billingZipPostal: Joi.string()
      .required()
      .trim(),
    billingPhone: Joi.string()
      .required()
      .trim(),
    billingEmail: Joi.string()
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
    company: Joi.string().allow('', null),
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
      .required()
      .trim(),
    timezone: Joi.string()
      .allow('', null)
      .trim(),
    timezoneAbbrev: Joi.string()
      .allow('', null)
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
    shippingCompany: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('company'),
      otherwise: Joi.string().allow('', null)
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
    billingSame: Joi.boolean().required(),
    billingName: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('name'),
      otherwise: Joi.string()
        .min(5)
        .max(50)
        .required()
        .trim()
    }),
    billingCompany: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('company'),
      otherwise: Joi.string().allow('', null)
    }),
    billingAddress1: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('address1'),
      otherwise: Joi.string()
        .min(10)
        .required()
        .trim()
    }),
    billingAddress2: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('address2'),
      otherwise: Joi.string()
        .trim()
        .allow('', null)
    }),
    billingCity: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('city'),
      otherwise: Joi.string()
        .required()
        .trim()
    }),
    billingStateProv: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('stateProv'),
      otherwise: Joi.string()
        .min(2)
        .required()
        .trim()
    }),
    billingCountry: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('country'),
      otherwise: Joi.string()
        .min(2)
        .required()
        .trim()
    }),
    billingZipPostal: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('zipPostal'),
      otherwise: Joi.string()
        .required()
        .trim()
    }),
    billingPhone: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('phone'),
      otherwise: Joi.string()
        .trim()
        .required()
    }),
    billingEmail: Joi.when('billingSame', {
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
    currentEmail: Joi.string()
      .email()
      .required(),
    newEmail: Joi.string()
      .email()
      .required(),
    confirmEmail: Joi.string()
      .valid(Joi.ref('newEmail'))
      .email()
      .required()
      .options({ language: { any: { allowOnly: 'and newEmail fields must match.' } } })
  };

  return Joi.validate(member, schema, joiOptions);
}

function validatePassword(member) {
  const schema = {
    oldPassword: Joi.string()
      .min(8)
      .required(),
    newPassword: Joi.string()
      .min(8)
      .required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .min(8)
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
    expiresIn: '4h' // *****   change to 8h for production
  };
  // eslint-disable-next-line no-underscore-dangle
  const token = jwt.sign({ _id: this._id }, config.get('jwtPrivateKey'), signOptions);
  return token;
};

exports.Member = mongoose.model('members', MemberSchema);
exports.validateNewRegister = validateNewRegister;
exports.validateNewMember = validateNewMember;
exports.validateUpdateMember = validateUpdateMember;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateNotification = validateNotification;
