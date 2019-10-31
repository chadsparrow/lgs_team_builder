const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const Float = require('mongoose-float').loadType(mongoose);

const joiOptions = { abortEarly: true, language: { key: '{{key}} ' } };

const StoreSchema = new mongoose.Schema(
  {
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teams'
    },
    storeName: {
      type: String,
      uppercase: true,
      trim: true
    },
    storeCountry: {
      type: String,
      uppercase: true,
      trim: true
    },
    brand: {
      type: String,
      uppercase: true,
      trim: true,
      enum: ['GARNEAU', 'SUGOI', 'SOMBRIO']
    },
    currency: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    orderReference: {
      type: String,
      required: true,
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
    mode: {
      type: String,
      required: true,
      uppercase: true,
      enum: ['SURVEY', 'OPEN', 'CLOSED', 'HOLD']
    },
    openingDate: {
      type: Date
    },
    closingDate: {
      type: Date
    },
    timezone: {
      type: String,
      required: true,
      trim: true
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    totalItemsOrdered: {
      type: Number,
      default: 0
    },
    ordersTotalValue: {
      type: Float,
      default: 0.0
    },
    collectedAmount: {
      type: Float,
      default: 0.0
    },
    storeMessage: {
      type: String,
      trim: true,
      maxlength: 255
    },
    shippingType: {
      type: String,
      required: true,
      uppercase: true,
      enum: ['BULK', 'DROP']
    },
    bulkShipping: {
      name: {
        type: String,
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
        trim: true
      },
      country: {
        type: String,
        uppercase: true,
        trim: true
      },
      zipPostal: {
        type: String,
        trim: true,
        uppercase: true
      },
      phone: {
        type: String
      },
      email: {
        type: String,
        trim: true
      }
    },
    extraCharges: [
      {
        name: {
          type: String
        },
        amount: {
          type: Float,
          default: 0.0
        }
      }
    ],
    collectedShippingCharges: [
      {
        memberId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'members'
        },
        amount: {
          type: Float,
          default: 0.0
        }
      }
    ]
  },
  { timestamps: true }
);

function validateStore(store) {
  const schema = {
    teamId: Joi.objectId().required(),
    storeName: Joi.string().trim(),
    storeCountry: Joi.string()
      .required()
      .trim(),
    currency: Joi.string()
      .required()
      .trim(),
    orderReference: Joi.string()
      .required()
      .trim(),
    adminId: Joi.objectId().required(),
    managerId: Joi.objectId().required(),
    mode: Joi.string()
      .valid(['SURVEY', 'OPEN', 'CLOSED', 'HOLD'])
      .required()
      .trim(),
    openingDate: Joi.date().allow('', null),
    closingDate: Joi.date().allow('', null),
    timezone: Joi.string()
      .required()
      .trim(),
    storeMessage: Joi.string()
      .allow('', null)
      .trim()
      .max(255),
    shippingType: Joi.string()
      .required()
      .trim()
      .valid(['BULK', 'DROP'])
  };
  return Joi.validate(store, schema, joiOptions);
}

exports.Store = mongoose.model('stores', StoreSchema);
exports.validateStore = validateStore;
