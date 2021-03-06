const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
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
    refOrder: {
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
      enum: ['BULK', 'DROP', 'PREPACK']
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
        _id: false,
        name: {
          type: String
        },
        amount: {
          type: Float,
          default: 0.0
        }
      }
    ],
    paidShipping: [
      {
        _id: false,
        memberId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'members'
        },
        amount: {
          type: Float,
          default: 0.0
        }
      }
    ],
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'catalogitems'
        },
        catalogId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'catalogs'
        },
        surveyLikedBy: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'members'
          }
        ],
        isActive: {
          type: Boolean,
          default: true
        },
        sizes: [
          {
            type: String,
            trim: true,
            required: true,
            minlength: 1,
            uppercase: true
          }
        ],
        gender: {
          type: String,
          uppercase: true,
          trim: true
        },
        categories: [
          {
            type: String,
            trim: true,
            uppercase: true
          }
        ],
        nameEN: {
          type: String,
          uppercase: true,
          trim: true
        },
        nameFR: {
          type: String,
          uppercase: true,
          trim: true
        },
        descriptionEN: {
          type: String,
          trim: true
        },
        descriptionFR: {
          type: String,
          trim: true
        },
        productCode: {
          type: String,
          uppercase: true,
          trim: true
        },
        styleCode: {
          type: String,
          uppercase: true,
          trim: true
        },
        refNumber: {
          type: String,
          uppercase: true,
          trim: true
        },
        images: [
          {
            type: String,
            lowercase: true,
            trim: true
          }
        ],
        mandatoryItem: {
          type: Boolean,
          default: false
        },
        storePrice: {
          type: Float,
          default: 0.0,
          required: true
        },
        actualPrice: {
          type: Float,
          default: 0.0,
          required: true
        },
        overrideActualPrice: {
          type: Boolean,
          default: false
        },
        priceBreakGoal: {
          type: Number
        },
        priceBreakIndex: {
          type: Number
        },
        priceBreaks: {
          CAD: [
            {
              price: {
                type: Float,
                default: 0.0
              },
              priceBreak: {
                type: String,
                trim: true
              }
            }
          ],
          USD: [
            {
              price: {
                type: Float,
                default: 0.0
              },
              priceBreak: {
                type: String,
                trim: true
              }
            }
          ]
        },
        taxPercentage: {
          type: Float,
          default: 0.0
        },
        taxAmount: {
          type: Float,
          default: 0.0
        },
        upChargeType: {
          type: String,
          default: '$'
        },
        upChargeAmount: {
          type: Float,
          default: 0.0
        },
        upChargeTotal: {
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
    storeName: Joi.string()
      .required()
      .trim(),
    storeCountry: Joi.string()
      .required()
      .trim(),
    currency: Joi.string()
      .required()
      .trim(),
    brand: Joi.string()
      .required()
      .valid(['GARNEAU', 'SUGOI', 'SOMBRIO'])
      .trim(),
    refOrder: Joi.string()
      .required()
      .trim(),
    adminId: Joi.objectId().required(),
    managerId: Joi.objectId().required(),
    mode: Joi.string()
      .required()
      .valid(['SURVEY', 'OPEN', 'CLOSED', 'HOLD'])
      .trim(),
    openingDate: Joi.date().allow('', null),
    closingDate: Joi.date().allow('', null),
    timezone: Joi.string()
      .required()
      .trim(),
    storeMessage: Joi.string()
      .max(255)
      .allow('', null)
      .trim(),
    shippingType: Joi.string()
      .required()
      .valid(['BULK', 'DROP', 'PREPACK'])
      .trim()
  };
  return Joi.validate(store, schema, joiOptions);
}

exports.Store = mongoose.model('stores', StoreSchema);
exports.validateStore = validateStore;
