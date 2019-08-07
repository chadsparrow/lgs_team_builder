const mongoose = require('mongoose');
const Float = require('mongoose-float');
const Joi = require('@hapi/joi');
const joi_options = { abortEarly: false, language: { key: '{{key}} ' } };

const OrderSchema = mongoose.Schema(
  {
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stores'
    },
    team_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'teams'
    },
    member_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'members'
    },
    drop_shipping: {
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
      state_prov: {
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
      zip_postal: {
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
    coupon_used: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'coupons'
    },
    order_discount: {
      type: Float,
      default: 0.0,
      min: 0.0
    },
    tax_percentage: {
      type: Float,
      default: 0.0,
      min: 0.0
    },
    sub_total: {
      type: Float,
      default: 0.0,
      min: 0.0
    },
    total_amount: {
      type: Float,
      default: 0.0,
      min: 0.0
    },
    amount_paid: {
      type: Float,
      default: 0.0
    },
    balance_owing: {
      type: Float,
      default: 0.0
    },
    order_date: {
      type: Date,
      required: true
    },
    currency: {
      type: String,
      trim: true
    },
    items: [
      {
        item_id: {
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
    store_id: Joi.objectId().required(),
    team_id: Joi.objectId().required(),
    member_id: Joi.objectId().required(),
    drop_contact: Joi.string()
      .trim()
      .min(5),
    drop_address1: Joi.string().trim(),
    drop_address2: Joi.string().trim(),
    drop_city: Joi.string().trim(),
    drop_state_prov: Joi.string()
      .min(2)
      .trim(),
    drop_country: Joi.string()
      .min(2)
      .trim(),
    drop_zip_postal: Joi.string()
      .min(5)
      .trim(),
    drop_phone: Joi.string()
      .regex(/^[0-9]{7,10}$/)
      .trim(),
    drop_email: Joi.string()
      .email()
      .trim(),
    coupon_used: Joi.objectId(),
    order_discount: Joi.number()
      .min(0)
      .trim(),
    tax_percentage: Joi.number()
      .min(0)
      .trim(),
    amount_paid: Joi.number()
      .min(0)
      .trim(),
    order_date: Joi.date(),
    items: Joi.array()
      .required()
      .min(1)
      .items({
        item_id: Joi.objectId(),
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

  return Joi.validate(order, schema, joi_options);
}

exports.Order = mongoose.model('orders', OrderSchema);
exports.validateOrder = validateOrder;
