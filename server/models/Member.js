const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const jwt = require('jsonwebtoken');
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
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().trim(false),
  };

  return Joi.validate(login, schema, joiOptions);
}

function validateNewRegister(member) {
  const schema = {
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required().trim(),
    name: Joi.string().min(5).max(50).required().trim(),
    company: Joi.string().allow('', null),
    address1: Joi.string().min(10).required().trim(),
    address2: Joi.string().trim().allow('', null),
    city: Joi.string().required().trim(),
    stateProv: Joi.string().min(2).required().trim(),
    country: Joi.string().min(2).required().trim(),
    zipPostal: Joi.string().required().trim(),
    phone: Joi.string().trim().required(),
    shippingSame: Joi.boolean(),
    shippingName: Joi.string().required().trim(),
    shippingCompany: Joi.string().allow('', null),
    shippingAddress1: Joi.string().required().trim(),
    shippingAddress2: Joi.string().allow('', null).trim(),
    shippingCity: Joi.string().required().trim(),
    shippingStateProv: Joi.string().min(2).required().trim(),
    shippingCountry: Joi.string().min(2).required().trim(),
    shippingZipPostal: Joi.string().required().trim(),
    shippingPhone: Joi.string().required().trim(),
    shippingEmail: Joi.string().required().email(),
    billingSame: Joi.boolean(),
    billingName: Joi.string().required().trim(),
    billingCompany: Joi.string().allow('', null),
    billingAddress1: Joi.string().required().trim(),
    billingAddress2: Joi.string().allow('', null).trim(),
    billingCity: Joi.string().required().trim(),
    billingStateProv: Joi.string().min(2).required().trim(),
    billingCountry: Joi.string().min(2).required().trim(),
    billingZipPostal: Joi.string().required().trim(),
    billingPhone: Joi.string().required().trim(),
    billingEmail: Joi.string().required().email(),
  };

  return Joi.validate(member, schema, joiOptions);
}

function validateNewMember(member) {
  const schema = {
    email: Joi.string().email().required(),
    name: Joi.string().min(5).max(50).required().trim(),
    company: Joi.string().allow('', null),
    address1: Joi.string().min(10).required().trim(),
    address2: Joi.string().trim().allow('', null),
    city: Joi.string().required().trim(),
    stateProv: Joi.string().min(2).required().trim(),
    country: Joi.string().min(2).required().trim(),
    zipPostal: Joi.string().required().trim(),
    phone: Joi.string().trim().required(),
    shippingSame: Joi.boolean(),
    shippingName: Joi.string().required().trim(),
    shippingCompany: Joi.string().allow('', null),
    shippingAddress1: Joi.string().required().trim(),
    shippingAddress2: Joi.string().allow('', null).trim(),
    shippingCity: Joi.string().required().trim(),
    shippingStateProv: Joi.string().min(2).required().trim(),
    shippingCountry: Joi.string().min(2).required().trim(),
    shippingZipPostal: Joi.string().required().trim(),
    shippingPhone: Joi.string().required().trim(),
    shippingEmail: Joi.string().required().email(),
    billingSame: Joi.boolean(),
    billingName: Joi.string().required().trim(),
    billingCompany: Joi.string().allow('', null),
    billingAddress1: Joi.string().required().trim(),
    billingAddress2: Joi.string().allow('', null).trim(),
    billingCity: Joi.string().required().trim(),
    billingStateProv: Joi.string().min(2).required().trim(),
    billingCountry: Joi.string().min(2).required().trim(),
    billingZipPostal: Joi.string().required().trim(),
    billingPhone: Joi.string().required().trim(),
    billingEmail: Joi.string().required().email(),
  };

  return Joi.validate(member, schema, joiOptions);
}

function validateUpdateMember(member) {
  const schema = {
    name: Joi.string().min(5).max(50).required().trim(),
    company: Joi.string().allow('', null),
    address1: Joi.string().min(10).required().trim(),
    address2: Joi.string().trim().allow('', null),
    city: Joi.string().required().trim(),
    stateProv: Joi.string().min(2).required().trim(),
    country: Joi.string().min(2).required().trim(),
    zipPostal: Joi.string().required().trim(),
    phone: Joi.string().required().trim(),
    shippingSame: Joi.boolean().required(),
    shippingName: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('name'),
      otherwise: Joi.string().min(5).max(50).required().trim(),
    }),
    shippingCompany: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('company'),
      otherwise: Joi.string().allow('', null),
    }),
    shippingAddress1: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('address1'),
      otherwise: Joi.string().min(10).required().trim(),
    }),
    shippingAddress2: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('address2'),
      otherwise: Joi.string().trim().allow('', null),
    }),
    shippingCity: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('city'),
      otherwise: Joi.string().required().trim(),
    }),
    shippingStateProv: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('stateProv'),
      otherwise: Joi.string().min(2).required().trim(),
    }),
    shippingCountry: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('country'),
      otherwise: Joi.string().min(2).required().trim(),
    }),
    shippingZipPostal: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('zipPostal'),
      otherwise: Joi.string().required().trim(),
    }),
    shippingPhone: Joi.when('shippingSame', {
      is: true,
      then: Joi.ref('phone'),
      otherwise: Joi.string().trim().required(),
    }),
    shippingEmail: Joi.when('shippingSame', {
      is: true,
      then: Joi.string().trim().allow('', null).email(),
      otherwise: Joi.string().trim().email().required(),
    }),
    billingSame: Joi.boolean().required(),
    billingName: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('name'),
      otherwise: Joi.string().min(5).max(50).required().trim(),
    }),
    billingCompany: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('company'),
      otherwise: Joi.string().allow('', null),
    }),
    billingAddress1: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('address1'),
      otherwise: Joi.string().min(10).required().trim(),
    }),
    billingAddress2: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('address2'),
      otherwise: Joi.string().trim().allow('', null),
    }),
    billingCity: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('city'),
      otherwise: Joi.string().required().trim(),
    }),
    billingStateProv: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('stateProv'),
      otherwise: Joi.string().min(2).required().trim(),
    }),
    billingCountry: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('country'),
      otherwise: Joi.string().min(2).required().trim(),
    }),
    billingZipPostal: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('zipPostal'),
      otherwise: Joi.string().required().trim(),
    }),
    billingPhone: Joi.when('billingSame', {
      is: true,
      then: Joi.ref('phone'),
      otherwise: Joi.string().trim().required(),
    }),
    billingEmail: Joi.when('billingSame', {
      is: true,
      then: Joi.string().trim().allow('', null).email(),
      otherwise: Joi.string().trim().email().required(),
    }),
  };
  return Joi.validate(member, schema, joiOptions);
}

function validateEmail(member) {
  const schema = {
    currentEmail: Joi.string().required().email(),
    newEmail: Joi.string().required().email().invalid(Joi.ref('currentEmail')),
    confirmEmail: Joi.string()
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
    email: Joi.string().email().required(),
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
    message: Joi.string().required(),
    clickTo: Joi.string().allow('', null),
  };

  return Joi.validate(notification, schema, joiOptions);
}

// eslint-disable-next-line func-names
MemberSchema.methods.generateAuthToken = function () {
  const signOptions = {
    expiresIn: '4h', // *****   change to 8h for production
  };
  // eslint-disable-next-line no-underscore-dangle
  const token = jwt.sign(
    { _id: this._id },
    process.env.JWT_PRIVATE_KEY,
    signOptions
  );
  return token;
};

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
