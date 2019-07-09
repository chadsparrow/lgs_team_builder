const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

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
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    },
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member'
    },
    useManagerDetails: {
      type: Boolean,
      default: false
    },
    contact: {
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
        required: true,
        trim: true
      },
      email: {
        type: String,
        trim: true,
        unique: true
      }
    },
    bulk_use_above_details: {
      type: Boolean,
      default: false
    },
    bulk_shipping: {
      contact_name: {
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
        trim: true,
        unique: true
      }
    },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }]
  },
  { timestamps: true }
);

function validateTeam(team) {
  const schema = {
    name: Joi.string().required(),
    logo: Joi.string().uri(),
    admin_id: Joi.objectId(),
    manager_id: Joi.objectId(),
    useManagerDetails: Joi.boolean(),
    contact_name: Joi.string()
      .min(5)
      .max(50)
      .trim(),
    contact_address1: Joi.string()
      .min(10)
      .trim(),
    contact_address2: Joi.string()
      .trim()
      .allow('', null),
    contact_city: Joi.string().trim(),
    contact_state_prov: Joi.string()
      .min(2)
      .trim(),
    contact_country: Joi.string()
      .min(2)
      .trim(),
    contact_zip_postal: Joi.string()
      .min(5)
      .trim(),
    contact_phone: Joi.string()
      .trim()
      .regex(/^[0-9]{7,10}$/),
    contact_email: Joi.string()
      .email()
      .required({ minDomainSegments: 2 }),
    bulk_use_above_details: Joi.boolean(),
    bulk_contact_name: Joi.string()
      .min(5)
      .max(50)
      .trim(),
    bulk_contact_address1: Joi.string()
      .min(10)
      .trim(),
    bulk_contact_address2: Joi.string()
      .trim()
      .allow('', null),
    bulk_contact_city: Joi.string().trim(),
    bulk_contact_state_prov: Joi.string()
      .min(2)
      .trim(),
    bulk_contact_country: Joi.string()
      .min(2)
      .trim(),
    bulk_contact_zip_postal: Joi.string()
      .min(5)
      .trim(),
    bulk_contact_phone: Joi.string()
      .trim()
      .regex(/^[0-9]{7,10}$/),
    bulk_contact_email: Joi.string().email(),
    members: Joi.array().items(Joi.objectId())
  };
  return Joi.validate(team, schema);
}

exports.Team = mongoose.model('teams', TeamSchema);
exports.validateTeam = validateTeam;
