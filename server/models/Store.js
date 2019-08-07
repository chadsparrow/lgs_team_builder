const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const Float = require('mongoose-float').loadType(mongoose);

const StoreSchema = new mongoose.Schema(
  {
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teams'
    },
    store_name: {
      type: String,
      uppercase: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    order_reference: {
      type: String,
      required: true,
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
    mode: {
      type: String,
      required: true,
      uppercase: true,
      enum: ['SURVEY', 'OPEN', 'CLOSED', 'HOLD']
    },
    opening_date: {
      type: Date,
      required: true
    },
    closing_date: {
      type: Date,
      required: true
    },
    timezone: {
      type: String,
      required: true,
      trim: true
    },
    total_orders: {
      type: Number,
      default: 0
    },
    total_items_ordered: {
      type: Number,
      default: 0
    },
    orders_value: {
      type: Float,
      default: 0.0
    },
    collected_amount: {
      type: Float,
      default: 0.0
    },
    store_message: {
      type: String,
      trim: true
    },
    shipping: {
      shipping_type: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['BULK', 'DROP']
      },
      use_team_manager_details: {
        type: Boolean,
        default: true
      },
      bulk_ship_contact_name: {
        type: String,
        uppercase: true,
        trim: true
      },
      bulk_ship_address1: {
        type: String,
        uppercase: true,
        trim: true,
        minlength: 10
      },
      bulk_ship_address2: {
        type: String,
        uppercase: true,
        trim: true
      },
      bulk_ship_city: {
        type: String,
        uppercase: true,
        trim: true
      },
      bulk_ship_state_prov: {
        type: String,
        uppercase: true,
        trim: true,
        minlength: 2
      },
      bulk_ship_country: {
        type: String,
        uppercase: true,
        trim: true,
        minlength: 2
      },
      bulk_ship_zip_postal: {
        type: String,
        uppercase: true,
        minlength: 5,
        trim: true
      },
      bulk_ship_phone: {
        type: String,
        trim: true
      },
      bulk_ship_email: {
        type: String,
        lowercase: true,
        trim: true
      }
    }
  },
  { timestamps: true }
);

function validateStore(store) {
  const schema = {
    team_id: Joi.objectId().required(),
    brand: Joi.string()
      .required()
      .trim(),
    store_name: Joi.string().trim(),
    currency: Joi.string()
      .required()
      .trim(),
    order_reference: Joi.string()
      .required()
      .trim(),
    admin_id: Joi.objectId().required(),
    manager_id: Joi.objectId().required(),
    mode: Joi.string()
      .valid(['SURVEY', 'OPEN', 'CLOSED', 'HOLD'])
      .required()
      .trim(),
    opening_date: Joi.date()
      .required()
      .min('now'),
    closing_date: Joi.date()
      .required()
      .greater(Joi.ref('opening_date')),
    timezone: Joi.string()
      .required()
      .trim(),
    store_message: Joi.string().trim(),
    shipping: Joi.object({
      shipping_type: Joi.string()
        .required()
        .trim()
        .valid(['BULK', 'DROP']),
      use_team_manager_details: Joi.boolean().required(),
      bulk_ship_contact_name: Joi.when('use_team_manager_details', {
        is: true,
        then: Joi.string().trim(),
        otherwise: Joi.string()
          .required()
          .trim()
      }),
      bulk_ship_address1: Joi.when('use_team_manager_details', {
        is: true,
        then: Joi.string().trim(),
        otherwise: Joi.string()
          .required()
          .trim()
          .min(10)
      }),
      bulk_ship_address2: Joi.string().trim(),
      bulk_ship_city: Joi.when('use_team_manager_details', {
        is: true,
        then: Joi.string().trim(),
        otherwise: Joi.string()
          .required()
          .trim()
      }),
      bulk_ship_state_prov: Joi.when('use_team_manager_details', {
        is: true,
        then: Joi.string()
          .trim()
          .min(2),
        otherwise: Joi.string()
          .required()
          .trim()
          .min(2)
      }),
      bulk_ship_country: Joi.when('use_team_manager_details', {
        is: true,
        then: Joi.string()
          .trim()
          .min(2),
        otherwise: Joi.string()
          .required()
          .trim()
          .min(2)
      }),
      bulk_ship_zip_postal: Joi.when('use_team_manager_details', {
        is: true,
        then: Joi.string()
          .trim()
          .min(5),
        otherwise: Joi.string()
          .required()
          .trim()
          .min(5)
      }),
      bulk_ship_phone: Joi.when('use_team_manager_details', {
        is: true,
        then: Joi.string().trim(),
        otherwise: Joi.string()
          .required()
          .trim()
      }),
      bulk_ship_email: Joi.when('use_team_manager_details', {
        is: true,
        then: Joi.string()
          .trim()
          .email(),
        otherwise: Joi.string()
          .required()
          .trim()
          .email()
      })
    })
  };
  return Joi.validate(store, schema);
}

exports.Store = mongoose.model('stores', StoreSchema);
exports.validateStore = validateStore;
