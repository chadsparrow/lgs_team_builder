const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const Float = require('mongoose-float').loadType(mongoose);
const joi_options = { abortEarly: false, language: { key: '{{key}} ' } };

const CartSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    items: [
      {
        code: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'catalogs'
        },
        qty: {
          type: Number,
          default: 0,
          min: 0
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
        sizes: [String]
      }
    ],
    discount: {
      coupon_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'coupons'
      }
    },
    tax_amount: {
      type: Float,
      default: 0.0,
      min: 0.0
    },
    total: {
      type: Float,
      default: 0.0,
      min: 0.0
    },
    mode: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

function validateCart(cart) {
  const schema = {
    owner: Joi.objectId().required(),
    items: Joi.array().items(
      Joi.object().keys({
        code: Joi.objectId().required(),
        qty: Joi.number()
          .min(0)
          .required(),
        price: Joi.number()
          .min(0)
          .required(),
        image: Joi.string().uri()
      })
    ),
    discount: Joi.object().keys({
      coupon_id: Joi.objectId().required()
    }),
    tax_amount: Joi.number()
      .required()
      .min(0),
    total: Joi.number()
      .required()
      .min(0),
    mode: Joi.string()
      .required()
      .trim()
  };
  return Joi.validate(cart, schema, joi_options);
}

exports.Cart = mongoose.model('carts', CartSchema);
exports.validateCart = validateCart;
