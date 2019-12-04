const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const Float = require('mongoose-float').loadType(mongoose);

const joiOptions = { abortEarly: true, language: { key: '{{key}} ' } };

const CartSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stores'
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'coupons'
    },
    orderDiscount: {
      type: Float,
      default: 0.0,
      min: 0
    },
    taxes: {
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
    currency: {
      type: String,
      trim: true,
      required: true
    },
    items: [
      {
        storeItemId: {
          type: mongoose.Schema.Types.ObjectId
        },
        quantity: {
          type: Number,
          default: 0
        },
        size: {
          type: String,
          trim: true
        },
        images: [String],
        nameEN: {
          type: String,
          trim: true
        },
        nameFR: {
          type: String,
          trim: true
        },
        styleCode: {
          type: String,
          trim: true
        },
        productCode: {
          type: String,
          trim: true
        },
        categories: [String],
        sizes: [String],
        mandatoryItem: {
          type: Boolean,
          default: true
        },
        storePrice: {
          type: Float
        }
      }
    ]
  },
  { timestamps: true }
);

exports.Cart = mongoose.model('carts', CartSchema);
