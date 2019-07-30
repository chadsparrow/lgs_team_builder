const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const Float = require('mongoose-float').loadType(mongoose);

const CouponSchema = new mongoose.Schema(
  {
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true
    },
    code: {
      type: String,
      required: true,
      uppercase: true,
      minlength: 5,
      maxlength: 12
    },
    description: {
      type: String,
      required: true,
      minlength: 5
    },
    discount_amount: {
      type: Float,
      required: true,
      min: 0
    },
    discount_type: {
      type: String,
      enum: ['%', '$'],
      trim: true,
      required: true
    },
    discount_applied: {
      type: String,
      enum: ['cart', 'items'],
      trim: true,
      required: true
    },
    coupon_type: {
      type: String,
      enum: ['member', 'amount'],
      trim: true,
      required: true
    },
    max_coupons: {
      type: Number,
      min: 1,
      required: true
    },
    coupons_used: {
      type: Number,
      min: 0,
      required: true
    },
    coupons_remaining: {
      type: Number,
      required: true
    },
    approved_items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stores'
      }
    ],
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'members'
      }
    ],
    start_date: {
      type: Date,
      required: true
    },
    end_date: {
      type: Date,
      required: true
    },
    timezone: {
      type: String,
      required: true
    }
  },
  { timestamps: true, retainKeyOrder: true }
);

function validateCoupon(coupon) {
  const schema = {
    store_id: Joi.objectId().required(),
    code: Joi.string()
      .min(5)
      .max(12)
      .required()
      .trim(),
    description: Joi.string()
      .required()
      .min(5)
      .trim(),
    discount_amount: Joi.number()
      .required()
      .min(0),
    discount_type: Joi.string()
      .valid(['%', '$'])
      .required(),
    discount_applied: Joi.string()
      .valid(['cart', 'items'])
      .required(),
    coupon_type: Joi.string()
      .valid(['member', 'amount'])
      .required(),
    max_coupons: Joi.number()
      .min(1)
      .required(true),
    coupons_used: Joi.number()
      .max(Joi.ref('max_coupons'))
      .required(),
    approved_items: Joi.array().items(Joi.objectId().required()),
    recipients: Joi.array().items(Joi.objectId().required()),
    start_date: Joi.date()
      .required()
      .min('now'),
    end_date: Joi.date()
      .required()
      .greater(Joi.ref('start_date')),
    timezone: Joi.string().required()
  };
  return Joi.validate(coupon, schema);
}

function validateAddAmount(message) {
  const schema = {
    amount: Joi.number()
      .required()
      .min(1)
  };
  return Joi.validate(message, schema);
}

exports.Coupon = mongoose.model('coupons', CouponSchema);
exports.validateCoupon = validateCoupon;
exports.validateAddAmount = validateAddAmount;
