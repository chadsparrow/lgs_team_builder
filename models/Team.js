const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

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
    timezone: {
      type: String
    },
    timezoneAbbrev: {
      type: String
    }
  },
  { timestamps: true }
);

function validateTeamName(team) {
  const schema = {
    name: Joi.string()
      .required()
      .trim(),
    adminId: Joi.objectId(),
    teamId: Joi.string()
      .allow('', null)
      .trim()
  };
  return Joi.validate(team, schema, joiOptions);
}

function validateTeam(team) {
  const schema = {
    logo: Joi.string()
      .uri()
      .allow('', null),
    adminId: Joi.objectId().required(),
    managerId: Joi.objectId(),
    teamId: Joi.string()
      .allow('', null)
      .trim(),
    mainContact: Joi.object({
      name: Joi.string()
        .required()
        .trim(),
      address1: Joi.string()
        .required()
        .trim(),
      address2: Joi.string().allow('', null),
      city: Joi.string().required(),
      stateProv: Joi.string()
        .min(2)
        .required()
        .trim(),
      country: Joi.string()
        .min(2)
        .max(2)
        .required(),
      zipPostal: Joi.string()
        .required()
        .trim(),
      phone: Joi.string()
        .required()
        .trim(),
      email: Joi.string()
        .email()
        .required()
        .trim()
    }).required(),
    bulkShipping: Joi.object({
      name: Joi.string()
        .required()
        .trim(),
      address1: Joi.string()
        .required()
        .trim(),
      address2: Joi.string().allow('', null),
      city: Joi.string().required(),
      stateProv: Joi.string()
        .min(2)
        .required()
        .trim(),
      country: Joi.string()
        .min(2)
        .max(2)
        .required(),
      zipPostal: Joi.string()
        .required()
        .trim(),
      phone: Joi.string()
        .required()
        .trim(),
      email: Joi.string()
        .email()
        .required()
        .trim()
    }).required(),
    timezone: Joi.string().required(),
    timezoneAbbrev: Joi.string().required()
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
exports.validateTeamName = validateTeamName;
exports.validateAddMember = validateAddMember;
