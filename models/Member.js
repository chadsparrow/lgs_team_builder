const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const config = require('config');
const jwt = require('jsonwebtoken');
const joi_options = { abortEarly: false, language: { key: '{{key}} ' } };

const MemberSchema = new mongoose.Schema(
  {
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
      required: true,
      minlength: 10,
      uppercase: true,
      trim: true
    },
    address2: {
      type: String,
      uppercase: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    state_prov: {
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
    zip_postal: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 5,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      minlength: 7,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    shipping_name: {
      type: String,
      required: function() {
        return this.shipping_same;
      },
      minlength: 5,
      uppercase: true,
      trim: true
    },
    shipping_address1: {
      type: String,
      required: function() {
        return this.shipping_same;
      },
      minlength: 10,
      uppercase: true,
      trim: true
    },
    shipping_address2: {
      type: String,
      uppercase: true,
      trim: true
    },
    shipping_city: {
      type: String,
      uppercase: true,
      required: function() {
        return this.shipping_same;
      },
      trim: true
    },
    shipping_state_prov: {
      type: String,
      uppercase: true,
      required: function() {
        return this.shipping_same;
      },
      minlength: 2,
      trim: true
    },
    shipping_country: {
      type: String,
      uppercase: true,
      required: function() {
        return this.shipping_same;
      },
      trim: true
    },
    shipping_zip_postal: {
      type: String,
      uppercase: true,
      required: function() {
        return this.shipping_same;
      },
      minlength: 5,
      trim: true
    },
    shipping_phone: {
      type: String,
      required: function() {
        return this.shipping_same;
      },
      trim: true,
      minlength: 7
    },
    shipping_email: {
      type: String,
      required: function() {
        return this.shipping_same;
      },
      trim: true
    },
    timezone: {
      type: String,
      trim: true
    },
    avatar_url: {
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
        click_to: {
          type: String
        }
      }
    ],
    is_admin: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

function validateNewMember(member) {
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
    state_prov: Joi.string()
      .min(2)
      .required()
      .trim(),
    country: Joi.string()
      .min(2)
      .required()
      .trim(),
    zip_postal: Joi.string()
      .required()
      .trim(),
    phone: Joi.string()
      .trim()
      .regex(/^[0-9]{7,10}$/)
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required()
      .trim(),
    shipping_same: Joi.boolean().required(),
    shipping_name: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('name'),
      otherwise: Joi.string()
        .min(5)
        .max(50)
        .required()
        .trim()
    }),
    shipping_address1: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('address1'),
      otherwise: Joi.string()
        .min(10)
        .required()
        .trim()
    }),
    shipping_address2: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('address2'),
      otherwise: Joi.string()
        .trim()
        .allow('', null)
    }),
    shipping_city: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('city'),
      otherwise: Joi.string()
        .required()
        .trim()
    }),
    shipping_state_prov: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('state_prov'),
      otherwise: Joi.string()
        .min(2)
        .required()
        .trim()
    }),
    shipping_country: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('country'),
      otherwise: Joi.string()
        .min(2)
        .required()
        .trim()
    }),
    shipping_zip_postal: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('zip_postal'),
      otherwise: Joi.string()
        .required()
        .trim()
    }),
    shipping_phone: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('phone'),
      otherwise: Joi.string()
        .trim()
        .regex(/^[0-9]{7,10}$/)
        .required()
    }),
    shipping_email: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('email'),
      otherwise: Joi.string()
        .email()
        .trim()
        .required()
    }),
    is_admin: Joi.boolean()
  };

  return Joi.validate(member, schema, joi_options);
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
    state_prov: Joi.string()
      .min(2)
      .required()
      .trim(),
    country: Joi.string()
      .min(2)
      .required()
      .trim(),
    zip_postal: Joi.string()
      .required()
      .trim(),
    phone: Joi.string()
      .regex(/^[0-9]{7,10}$/)
      .required()
      .trim(),
    shipping_same: Joi.boolean().required(),
    shipping_name: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('name'),
      otherwise: Joi.string()
        .min(5)
        .max(50)
        .required()
        .trim()
    }),
    shipping_address1: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('address1'),
      otherwise: Joi.string()
        .min(10)
        .required()
        .trim()
    }),
    shipping_address2: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('address2'),
      otherwise: Joi.string()
        .trim()
        .allow('', null)
    }),
    shipping_city: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('city'),
      otherwise: Joi.string()
        .required()
        .trim()
    }),
    shipping_state_prov: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('state_prov'),
      otherwise: Joi.string()
        .min(2)
        .required()
        .trim()
    }),
    shipping_country: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('country'),
      otherwise: Joi.string()
        .min(2)
        .required()
        .trim()
    }),
    shipping_zip_postal: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('zip_postal'),
      otherwise: Joi.string()
        .required()
        .trim()
    }),
    shipping_phone: Joi.when('shipping_same', {
      is: true,
      then: Joi.ref('phone'),
      otherwise: Joi.string()
        .trim()
        .regex(/^[0-9]{7,10}$/)
        .required()
    }),
    shipping_email: Joi.when('shipping_same', {
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
    is_admin: Joi.boolean()
  };
  return Joi.validate(member, schema, joi_options);
}

function validateEmail(member) {
  const schema = {
    email: Joi.string()
      .email()
      .required()
  };

  return Joi.validate(member, schema, joi_options);
}

function validatePassword(member) {
  const schema = {
    oldpassword: Joi.string()
      .min(8)
      .required(),
    newpassword: Joi.string()
      .disallow(Joi.ref('oldpassword'))
      .min(8)
      .required(),
    confirmpassword: Joi.string()
      .valid(Joi.ref('newpassword'))
      .required()
      .options({ language: { any: { allowOnly: 'and newpassword fields must match.' } } })
  };

  return Joi.validate(member, schema, joi_options);
}

function validateNotification(notification) {
  const schema = {
    recipients: Joi.array()
      .required()
      .items(Joi.objectId().required()),
    message: Joi.string().required(),
    click_to: Joi.string().allow('', null)
  };

  return Joi.validate(notification, schema, joi_options);
}

MemberSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, is_admin: this.is_admin }, config.get('jwtPrivateKey'));
  return token;
};

exports.Member = mongoose.model('members', MemberSchema);
exports.validateNewMember = validateNewMember;
exports.validateUpdateMember = validateUpdateMember;
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateNotification = validateNotification;
