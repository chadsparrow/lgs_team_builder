const mongoose = require('mongoose');
const Float = require('mongoose-float');
const Joi = require('@hapi/joi');

const joiOptions = { abortEarly: true, language: { key: '{{key}} ' } };

const StoreItemSchema = mongoose.Schema(
  {
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stores'
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'catalogitems'
    },
    catalogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'catalogs'
    },
    brand: {
      type: String,
      required: true,
      trim: true
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
    price: {
      type: Float,
      default: 0.0,
      required: true
    },
    priceBreakGoal: {
      type: Number
    },
    upChargeType: {
      type: String,
      default: '$'
    },
    upChargeAmount: {
      type: Float,
      default: 0.0
    }
  },
  { timestamps: true }
);

function validateStoreItemEdit(item) {
  const schema = {
    storeId: Joi.objectId().require(),
    itemId: Joi.objectId().required(),
    catalogId: Joi.objectId().required(),
    brand: Joi.string()
      .required()
      .trim(),
    gender: Joi.string()
      .required()
      .trim(),
    isActive: Joi.boolean(),
    sizes: Joi.array().items(
      Joi.string()
        .min(1)
        .required()
        .trim()
    ),
    categories: Joi.array().items(Joi.string().trim()),
    nameEN: Joi.string()
      .required()
      .trim(),
    nameFR: Joi.string()
      .allow('', null)
      .trim(),
    descriptionEN: Joi.string()
      .required()
      .trim(),
    descriptionFR: Joi.string()
      .allow('', null)
      .trim(),
    productCode: Joi.string()
      .required()
      .trim(),
    styleCode: Joi.string()
      .required()
      .trim(),
    refNumber: Joi.string()
      .allow('', null)
      .trim(),
    images: Joi.array().items(Joi.string().trim()),
    mandatoryItem: Joi.boolean(),
    price: Joi.number()
      .allow(null)
      .min(0)
      .required()
      .trim(),
    priceBreakGoal: Joi.number()
      .allow(null)
      .min(0)
      .trim(),
    upChargeType: Joi.string()
      .trim()
      .allow(null, ''),
    upChargeAmount: Joi.number()
      .allow(null)
      .min(0)
  };
  return Joi.validate(item, schema, joiOptions);
}

exports.StoreItem = mongoose.model('storeitems', StoreItemSchema);
exports.validateStoreItemEdit = validateStoreItemEdit;
