/* eslint-disable camelcase */
const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const Float = require('mongoose-float').loadType(mongoose);

const joi_options = { abortEarly: false, language: { key: '{{key}} ' } };

const CartSchema = new mongoose.Schema(
  {
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teams'
    },
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stores'
    },
    coupon_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'coupons'
    },
    order_discount: {
      type: Float,
      default: 0.0,
      min: 0
    },
    tax_percentage: {
      type: Float,
      default: 0.0,
      min: 0.0
    },
    sub_total: {
      type: Float,
      default: 0.0
    },
    total_amount: {
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
        item_id: {
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
    member_id: Joi.objectId().required(),
    team_id: Joi.objectId().required(),
    store_id: Joi.objectId().required(),
    coupon_id: Joi.object().required(),
    order_discount: Joi.number().min(0),
    tax_percentage: Joi.number().min(0),
    currency: Joi.string().required(),
    items: Joi.array()
      .required()
      .items({
        item_id: Joi.objectId().required(),
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
  return Joi.validate(cart, schema, joi_options);
}

exports.Cart = mongoose.model('carts', CartSchema);
exports.validateCart = validateCart;
