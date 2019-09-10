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
      type: Date,
      required: true
    },
    closingDate: {
      type: Date,
      required: true
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
      trim: true
    },
    shipping: {
      shippingType: {
        type: String,
        required: true,
        uppercase: true,
        enum: ['BULK', 'DROP']
      },
      bulkShipContactName: {
        type: String,
        uppercase: true,
        trim: true
      },
      bulkShipAddress1: {
        type: String,
        uppercase: true,
        trim: true,
        minlength: 10
      },
      bulkShipAddress2: {
        type: String,
        uppercase: true,
        trim: true
      },
      bulkShipCity: {
        type: String,
        uppercase: true,
        trim: true
      },
      bulkShipStateProv: {
        type: String,
        uppercase: true,
        trim: true,
        minlength: 2
      },
      bulkShipCountry: {
        type: String,
        uppercase: true,
        trim: true,
        minlength: 2
      },
      bulkShipZipPostal: {
        type: String,
        uppercase: true,
        minlength: 5,
        trim: true
      },
      bulkShipPhone: {
        type: String,
        trim: true
      },
      bulkShipEmail: {
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
    teamId: Joi.objectId().required(),
    brand: Joi.string()
      .required()
      .trim(),
    storeName: Joi.string().trim(),
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
    openingDate: Joi.date()
      .required()
      .min('now'),
    closingDate: Joi.date()
      .required()
      .greater(Joi.ref('openingDate')),
    timezone: Joi.string()
      .required()
      .trim(),
    storeMessage: Joi.string().trim(),
    shipping: Joi.object({
      shippingType: Joi.string()
        .required()
        .trim()
        .valid(['BULK', 'DROP']),
      useTeamManagerDetails: Joi.boolean().required(),
      bulkShipContactName: Joi.when('useTeamManagerDetails', {
        is: true,
        then: Joi.string().trim(),
        otherwise: Joi.string()
          .required()
          .trim()
      }),
      bulkShipAddress1: Joi.when('useTeamManagerDetails', {
        is: true,
        then: Joi.string().trim(),
        otherwise: Joi.string()
          .required()
          .trim()
          .min(10)
      }),
      bulkShipAddress2: Joi.string().trim(),
      bulkShipCity: Joi.when('useTeamManagerDetails', {
        is: true,
        then: Joi.string().trim(),
        otherwise: Joi.string()
          .required()
          .trim()
      }),
      bulkShipStateProv: Joi.when('useTeamManagerDetails', {
        is: true,
        then: Joi.string()
          .trim()
          .min(2),
        otherwise: Joi.string()
          .required()
          .trim()
          .min(2)
      }),
      bulkShipCountry: Joi.when('useTeamManagerDetails', {
        is: true,
        then: Joi.string()
          .trim()
          .min(2),
        otherwise: Joi.string()
          .required()
          .trim()
          .min(2)
      }),
      bulkShipZipPostal: Joi.when('useTeamManagerDetails', {
        is: true,
        then: Joi.string()
          .trim()
          .min(5),
        otherwise: Joi.string()
          .required()
          .trim()
          .min(5)
      }),
      bulkShipPhone: Joi.when('useTeamManagerDetails', {
        is: true,
        then: Joi.string().trim(),
        otherwise: Joi.string()
          .required()
          .trim()
      }),
      bulkShipEmail: Joi.when('useTeamManagerDetails', {
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
  return Joi.validate(store, schema, joiOptions);
}

exports.Store = mongoose.model('stores', StoreSchema);
exports.validateStore = validateStore;
