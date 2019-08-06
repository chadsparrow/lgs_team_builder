const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const joi_options = { abortEarly: false, language: { key: '{{key}} ' } };

const TeamSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      uppercase: true,
      required: true,
      trim: true
    },
    logo: {
      type: String,
      trim: true
    },
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    main_contact: {
      contact: {
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
      state_prov: {
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
      zip_postal: {
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
    bulk_shipping: {
      contact: {
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
      state_prov: {
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
      zip_postal: {
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
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'members' }],
    team_timezone: {
      type: String
    }
  },
  { timestamps: true }
);

function validateTeamName(team) {
  const schema = {
    name: Joi.string().required()
  };
  return Joi.validate(team, schema, joi_options);
}

function validateTeam(team) {
  const schema = {
    logo: Joi.string()
      .uri()
      .allow('', null),
    admin_id: Joi.objectId().required(),
    manager_id: Joi.objectId().required(),
    useManagerDetails: Joi.boolean().required(),
    contact_name: Joi.when('useManagerDetails', {
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
    contact_address1: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .min(10)
        .trim()
        .required(),
      otherwise: Joi.string()
        .min(10)
        .trim()
    }),
    contact_address2: Joi.string()
      .trim()
      .allow('', null),
    contact_city: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .trim()
        .required(),
      otherwise: Joi.string().trim()
    }),
    contact_state_prov: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .min(2)
        .trim()
        .required(),
      otherwise: Joi.string()
        .min(2)
        .trim()
    }),
    contact_country: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .min(2)
        .trim()
        .required(),
      otherwise: Joi.string()
        .min(2)
        .trim()
    }),
    contact_zip_postal: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .trim()
        .required(),
      otherwise: Joi.string().trim()
    }),
    contact_phone: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .trim()
        .regex(/^[0-9]{7,10}$/)
        .required(),
      otherwise: Joi.string()
        .trim()
        .regex(/^[0-9]{7,10}$/)
    }),
    contact_email: Joi.when('useManagerDetails', {
      is: false,
      then: Joi.string()
        .email()
        .required(),
      otherwise: Joi.string().email()
    }),
    bulk_use_above_details: Joi.boolean().required(),
    bulk_contact_name: Joi.when('bulk_use_above_details', {
      is: true,
      then: Joi.ref('contact_name'),
      otherwise: Joi.string()
        .min(5)
        .max(50)
        .trim()
        .required()
    }),
    bulk_contact_address1: Joi.when('bulk_use_above_details', {
      is: true,
      then: Joi.ref('contact_address1'),
      otherwise: Joi.string()
        .min(10)
        .trim()
        .required()
    }),
    bulk_contact_address2: Joi.when('bulk_use_above_details', {
      is: true,
      then: Joi.ref('contact_address2'),
      otherwise: Joi.string()
        .trim()
        .allow('', null)
    }),
    bulk_contact_city: Joi.when('bulk_use_above_details', {
      is: true,
      then: Joi.ref('contact_city'),
      otherwise: Joi.string()
        .trim()
        .required()
    }),
    bulk_contact_state_prov: Joi.when('bulk_use_above_details', {
      is: true,
      then: Joi.ref('contact_state_prov'),
      otherwise: Joi.string()
        .min(2)
        .trim()
        .required()
    }),
    bulk_contact_country: Joi.when('bulk_use_above_details', {
      is: true,
      then: Joi.ref('contact_country'),
      otherwise: Joi.string()
        .min(2)
        .trim()
        .required()
    }),
    bulk_contact_zip_postal: Joi.when('bulk_use_above_details', {
      is: true,
      then: Joi.ref('contact_zip_postal'),
      otherwise: Joi.string()
        .trim()
        .required()
    }),
    bulk_contact_phone: Joi.when('bulk_use_above_details', {
      is: true,
      then: Joi.ref('contact_phone'),
      otherwise: Joi.string()
        .trim()
        .regex(/^[0-9]{7,10}$/)
        .required()
    }),
    bulk_contact_email: Joi.when('bulk_use_above_details', {
      is: true,
      then: Joi.ref('contact_email'),
      otherwise: Joi.string()
        .email()
        .required()
    }),
    team_timezone: Joi.string().required()
  };
  return Joi.validate(team, schema, joi_options);
}

function validateAddMember(member) {
  const schema = {
    id: Joi.objectId().required()
  };
  return Joi.validate(member, schema, joi_options);
}

exports.Team = mongoose.model('teams', TeamSchema);
exports.validateTeam = validateTeam;
exports.validateTeamName = validateTeamName;
exports.validateAddMember = validateAddMember;
