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
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teams'
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
    taxPercentage: {
      type: Float,
      default: 0.0,
      min: 0.0
    },
    subTotal: {
      type: Float,
      default: 0.0
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
        itemId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'storeitems'
        },
        quantity: {
          type: Number,
          default: 0,
          min: 1
        },
        price: {
          type: Float,
          min: 0.0,
          default: 0.0
        },
        image: {
          type: String,
          trim: true
        },
        size: {
          type: String,
          minlength: 1,
          trim: true
        },
        discount: {
          type: Float,
          default: 0.0
        }
      }
    ]
  },
  { timestamps: true }
);

function validateCart(cart) {
  const schema = {
    memberId: Joi.objectId().required(),
    teamId: Joi.objectId().required(),
    storeId: Joi.objectId().required(),
    couponId: Joi.object().required(),
    orderDiscount: Joi.number().min(0),
    taxPercentage: Joi.number().min(0),
    currency: Joi.string().required(),
    items: Joi.array()
      .required()
      .items({
        itemId: Joi.objectId().required(),
        quantity: Joi.number().min(1),
        price: Joi.number().min(0),
        image: Joi.string()
          .uri()
          .trim(),
        size: Joi.string()
          .min(1)
          .trim(),
        discount: Joi.number().min(0)
      })
  };
  return Joi.validate(cart, schema, joiOptions);
}

exports.Cart = mongoose.model('carts', CartSchema);
exports.validateCart = validateCart;
