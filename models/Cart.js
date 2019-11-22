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
        nameEN: {
          type: String,
          trim: true,
          required: true
        },
        nameFR: {
          type: String,
          trim: true
        },
        images: [{ type: String, trim: true }],
        categories: [
          {
            type: String,
            trim: true
          }
        ],
        price: {
          type: Float
        },
        quantity: {
          type: Number,
          default: 0,
          min: 1
        },
        finalItemPrice: {
          type: Float,
          min: 0.0,
          default: 0.0
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
    storeId: Joi.objectId().required(),
    couponId: Joi.object().allow(null),
    items: Joi.array()
      .required()
      .items({
        storeItemId: Joi.objectId().required(),
        quantity: Joi.number().min(1),
        size: Joi.string()
          .min(1)
          .trim(),
        images: Joi.array().items(
          Joi.string()
            .trim()
            .allow('', null)
        )
      })
  };
  return Joi.validate(cart, schema, joiOptions);
}

exports.Cart = mongoose.model('carts', CartSchema);
exports.validateCart = validateCart;
