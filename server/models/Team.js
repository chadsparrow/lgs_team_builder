const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);

const joiOptions = { abortEarly: true, language: { key: '{{key}} ' } };

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      uppercase: true,
      required: true,
      trim: true,
      unique: true
    },
    logo: {
      type: String,
      trim: true,
      default: null
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    teamId: {
      type: String,
      trim: true
    },
    mainContact: {
      name: {
        type: String,
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
        type: String,
        trim: true
      },
      email: {
        type: String,
        trim: true
      }
    },
    bulkShipping: {
      name: {
        type: String,
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
        type: String,
        trim: true
      },
      email: {
        type: String,
        trim: true
      }
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'members'
      }
    ],
    stores: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'teams'
      }
    ],
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ['Point'],
        required: true
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
        required: true
      }
    },
    timezone: {
      type: String
    }
  },
  { timestamps: true }
);

function validateTeam(team) {
  const schema = {
    name: Joi.string().required(),
    logo: Joi.string()
      .uri()
      .allow('', null),
    adminId: Joi.objectId().required(),
    managerId: Joi.objectId(),
    teamId: Joi.string()
      .allow('', null)
      .trim(),
    contactName: Joi.string()
      .required()
      .trim(),
    contactCompany: Joi.string().allow('', null),
    contactAddress1: Joi.string()
      .required()
      .trim(),
    contactAddress2: Joi.string().allow('', null),
    contactCity: Joi.string().required(),
    contactStateProv: Joi.string()
      .required()
      .min(2)
      .trim(),
    contactCountry: Joi.string()
      .required()
      .min(2)
      .max(2),
    contactZipPostal: Joi.string()
      .required()
      .trim(),
    contactPhone: Joi.string()
      .required()
      .trim(),
    contactEmail: Joi.string()
      .required()
      .email()
      .trim(),
    shippingName: Joi.string()
      .required()
      .trim(),
    shippingCompany: Joi.string().allow('', null),
    shippingAddress1: Joi.string()
      .required()
      .trim(),
    shippingAddress2: Joi.string().allow('', null),
    shippingCity: Joi.string().required(),
    shippingStateProv: Joi.string()
      .required()
      .min(2)
      .trim(),
    shippingCountry: Joi.string()
      .required()
      .min(2)
      .max(2),
    shippingZipPostal: Joi.string()
      .required()
      .trim(),
    shippingPhone: Joi.string()
      .required()
      .trim(),
    shippingEmail: Joi.string()
      .required()
      .email()
      .trim()
  };
  return Joi.validate(team, schema, joiOptions);
}

function validateAddMember(member) {
  const schema = {
    memberId: Joi.objectId().required()
  };
  return Joi.validate(member, schema, joiOptions);
}

exports.Team = mongoose.model('teams', TeamSchema);
exports.validateTeam = validateTeam;
exports.validateAddMember = validateAddMember;
