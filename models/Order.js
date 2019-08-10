const mongoose = require('mongoose');
const Float = require('mongoose-float');
const Joi = require('@hapi/joi');

const joiOptions = { abortEarly: false, language: { key: '{{key}} ' } };

const OrderSchema = mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stores'
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teams'
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    dropShipping: {
      contact: {
        type: String,
        trim: true,
        uppercase: true
      },
      address1: {
        type: String,
        trim: true,
        uppercase: true
      },
      address2: {
        type: String,
        trim: true,
        uppercase: true
      },
      city: {
        type: String,
        trim: true,
        uppercase: true
      },
      stateProv: {
        type: String,
        trim: true,
        uppercase: true,
        minlength: 2
      },
      country: {
        type: String,
        trim: true,
        uppercase: true,
        minlength: 2
      },
      zipPostal: {
        type: String,
        trim: true,
        uppercase: true,
        minlength: 5
      },
      phone: {
        type: String,
        uppercase: true,
        trim: true
      },
      email: {
        type: String,
        lowercase: true,
        trim: true
      }
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'coupons'
    },
    orderDiscount: {
      type: Float,
      default: 0.0,
      min: 0.0
    },
    taxPercentage: {
      type: Float,
      default: 0.0,
      min: 0.0
    },
    subTotal: {
      type: Float,
      default: 0.0,
      min: 0.0
    },
    totalAmount: {
      type: Float,
      default: 0.0,
      min: 0.0
    },
    balanceOwing: {
      type: Float,
      default: 0.0
    },
    orderDate: {
      type: Date,
      required: true
    },
    currency: {
      type: String,
      trim: true
    },
    items: [
      {
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'storeitems'
        },
        price: {
          type: Float,
          min: 0.0,
          default: 0.0
        },
        size: {
          type: String,
          minlength: 1,
          trim: true
        },
        quantity: {
          type: Number,
          default: 0
        },
        discount: {
          type: Float,
          default: 0.0
        },
        image: {
          type: String,
          trim: true
        }
      }
    ]
  },
  { timestamps: true }
);

function validateOrder(order) {
  const schema = {
    storeId: Joi.objectId().required(),
    teamId: Joi.objectId().required(),
    memberId: Joi.objectId().required(),
    dropContact: Joi.string()
      .trim()
      .min(5),
    dropAddress1: Joi.string().trim(),
    dropAddress2: Joi.string().trim(),
    dropCity: Joi.string().trim(),
    dropStateProv: Joi.string()
      .min(2)
      .trim(),
    dropCountry: Joi.string()
      .min(2)
      .trim(),
    dropZipPostal: Joi.string()
      .min(5)
      .trim(),
    dropPhone: Joi.string()
      .regex(/^[0-9]{7,10}$/)
      .trim(),
    dropEmail: Joi.string()
      .email()
      .trim(),
    couponId: Joi.objectId(),
    orderDiscount: Joi.number()
      .min(0)
      .trim(),
    taxPercentage: Joi.number()
      .min(0)
      .trim(),
    orderDate: Joi.date(),
    items: Joi.array()
      .required()
      .min(1)
      .items({
        itemId: Joi.objectId(),
        size: Joi.string()
          .min(1)
          .trim(),
        quantity: Joi.number()
          .min(0)
          .required(),
        discount: Joi.number().min(0),
        price: Joi.number().min(0),
        image: Joi.string()
          .uri()
          .trim()
      })
  };

  return Joi.validate(order, schema, joiOptions);
}

exports.Order = mongoose.model('orders', OrderSchema);
exports.validateOrder = validateOrder;
