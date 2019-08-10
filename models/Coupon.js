const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const Float = require('mongoose-float').loadType(mongoose);

const joiOptions = { abortEarly: false, language: { key: '{{key}} ' } };

const CouponSchema = new mongoose.Schema(
  {
    storeId: {
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
    discountAmount: {
      type: Float,
      required: true,
      min: 0
    },
    discountType: {
      type: String,
      enum: ['%', '$'],
      trim: true,
      required: true
    },
    discountApplied: {
      type: String,
      enum: ['cart', 'items'],
      trim: true,
      required: true
    },
    couponType: {
      type: String,
      enum: ['member', 'amount'],
      trim: true,
      required: true
    },
    maxCoupons: {
      type: Number,
      min: 1,
      required: true
    },
    couponsUsed: {
      type: Number,
      min: 0,
      required: true
    },
    couponsRemaining: {
      type: Number,
      required: true
    },
    approvedItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'storeitems'
      }
    ],
    recipients: [
      {
        memberId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'members'
        },
        expired: {
          type: Boolean,
          default: false
        }
      }
    ],
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    timezone: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

function validateCoupon(coupon) {
  const schema = {
    storeId: Joi.objectId().required(),
    code: Joi.string()
      .min(5)
      .max(12)
      .required()
      .trim(),
    description: Joi.string()
      .required()
      .min(5)
      .trim(),
    discountAmount: Joi.number()
      .required()
      .min(0),
    discountType: Joi.string()
      .valid(['%', '$'])
      .required(),
    discountApplied: Joi.string()
      .valid(['cart', 'items'])
      .required(),
    couponType: Joi.string()
      .valid(['member', 'amount'])
      .required(),
    maxCoupons: Joi.number()
      .min(1)
      .required(true),
    couponsUsed: Joi.number()
      .max(Joi.ref('max_coupons'))
      .required(),
    approvedItems: Joi.when('discountApplied', {
      is: 'items',
      then: Joi.array()
        .min(1)
        .required()
        .items(Joi.objectId().required())
    }),
    recipients: Joi.when('couponType', {
      is: 'member',
      then: Joi.array()
        .min(1)
        .required()
        .items({ memberId: Joi.objectId().required() })
    }),
    startDate: Joi.date()
      .required()
      .min('now'),
    endDate: Joi.date()
      .required()
      .greater(Joi.ref('startDate')),
    timezone: Joi.string().required()
  };
  return Joi.validate(coupon, schema, joiOptions);
}

function validateCouponEdit(coupon) {
  const schema = {
    code: Joi.string()
      .min(5)
      .max(12)
      .required()
      .trim(),
    description: Joi.string()
      .required()
      .min(5)
      .trim(),
    discountAmount: Joi.number()
      .required()
      .min(0),
    discountType: Joi.string()
      .valid(['%', '$'])
      .required(),
    discountApplied: Joi.string()
      .valid(['cart', 'items'])
      .required(),
    couponType: Joi.string()
      .valid(['member', 'amount'])
      .required(),
    maxCoupons: Joi.number()
      .min(1)
      .required(true),
    couponsUsed: Joi.number()
      .max(Joi.ref('maxCoupons'))
      .required(),
    approvedItems: Joi.array().items(Joi.objectId().required()),
    recipients: Joi.array().items({ memberId: Joi.objectId().required(), expired: Joi.boolean() }),
    startDate: Joi.date()
      .required()
      .min('now'),
    endDate: Joi.date()
      .required()
      .greater(Joi.ref('startDate')),
    timezone: Joi.string().required()
  };
  return Joi.validate(coupon, schema, joiOptions);
}

function validateAddAmount(message) {
  const schema = {
    amount: Joi.number()
      .required()
      .min(1)
  };
  return Joi.validate(message, schema, joiOptions);
}

exports.Coupon = mongoose.model('coupons', CouponSchema);
exports.validateCoupon = validateCoupon;
exports.validateAddAmount = validateAddAmount;
exports.validateCouponEdit = validateCouponEdit;
