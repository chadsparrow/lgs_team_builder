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
      trim: true
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    mainContact: {
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'members'
      },
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
      memberId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'members'
      },
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
    }
  },
  { timestamps: true }
);

function validateTeamName(team) {
  const schema = {
    name: Joi.string().required()
  };
  return Joi.validate(team, schema, joiOptions);
}

function validateTeam(team) {
  const schema = {
    logo: Joi.string()
      .uri()
      .allow('', null),
    adminId: Joi.objectId().required(),
    managerId: Joi.objectId().required(),
    useManagerDetails: Joi.boolean().required(),
    contactName: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .min(5)
        .max(50)
        .trim()
        .required(),
      otherwise: Joi.string()
        .min(5)
        .max(50)
        .trim()
    }),
    contactAddress1: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .min(10)
        .trim()
        .required(),
      otherwise: Joi.string()
        .min(10)
        .trim()
    }),
    contactAddress2: Joi.string()
      .trim()
      .allow('', null),
    contactCity: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .trim()
        .required(),
      otherwise: Joi.string().trim()
    }),
    contactStateProv: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .min(2)
        .trim()
        .required(),
      otherwise: Joi.string()
        .min(2)
        .trim()
    }),
    contactCountry: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .min(2)
        .trim()
        .required(),
      otherwise: Joi.string()
        .min(2)
        .trim()
    }),
    contactZipPostal: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .trim()
        .required(),
      otherwise: Joi.string().trim()
    }),
    contactPhone: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .trim()
        .regex(/^[0-9]{7,10}$/)
        .required(),
      otherwise: Joi.string()
        .trim()
        .regex(/^[0-9]{7,10}$/)
    }),
    contactEmail: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .email()
        .required(),
      otherwise: Joi.string().email()
    }),
    bulkUseAboveDetails: Joi.boolean().required(),
    bulkContactName: Joi.when('bulkUseAboveDetails', {
      is: true,
      then: Joi.ref('contactName'),
      otherwise: Joi.string()
        .min(5)
        .max(50)
        .trim()
        .required()
    }),
    bulkContactAddress1: Joi.when('bulkUseAboveDetails', {
      is: true,
      then: Joi.ref('contactAddress1'),
      otherwise: Joi.string()
        .min(10)
        .trim()
        .required()
    }),
    bulkContactAddress2: Joi.when('bulkUseAboveDetails', {
      is: true,
      then: Joi.ref('contactAddress2'),
      otherwise: Joi.string()
        .trim()
        .allow('', null)
    }),
    bulkContactCity: Joi.when('bulkUseAboveDetails', {
      is: true,
      then: Joi.ref('contactCity'),
      otherwise: Joi.string()
        .trim()
        .required()
    }),
    bulkContactStateProv: Joi.when('bulkUseAboveDetails', {
      is: true,
      then: Joi.ref('contactStateProv'),
      otherwise: Joi.string()
        .min(2)
        .trim()
        .required()
    }),
    bulkContactCountry: Joi.when('bulkUseAboveDetails', {
      is: true,
      then: Joi.ref('contactCountry'),
      otherwise: Joi.string()
        .min(2)
        .trim()
        .required()
    }),
    bulkContactZipPostal: Joi.when('bulkUseAboveDetails', {
      is: true,
      then: Joi.ref('contactZipPostal'),
      otherwise: Joi.string()
        .trim()
        .required()
    }),
    bulkContactPhone: Joi.when('bulkUseAboveDetails', {
      is: true,
      then: Joi.ref('contactPhone'),
      otherwise: Joi.string()
        .trim()
        .regex(/^[0-9]{7,10}$/)
        .required()
    }),
    bulkContactEmail: Joi.when('bulkUseAboveDetails', {
      is: true,
      then: Joi.ref('contactEmail'),
      otherwise: Joi.string()
        .email()
        .required()
    }),
    timezone: Joi.string().required()
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
