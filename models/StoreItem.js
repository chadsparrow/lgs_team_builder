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
    sizesOffered: [
      {
        type: String,
        trim: true,
        required: true,
        minlength: 1,
        uppercase: true,
        unique: true
      }
    ],
    category: {
      type: String,
      uppercase: true,
      trim: true
    },
    name: {
      type: String,
      uppercase: true,
      trim: true
    },
    code: {
      type: String,
      uppercase: true,
      trim: true
    },
    number: {
      type: String,
      uppercase: true,
      trim: true
    },
    images: [
      {
        name: {
          type: String,
          uppercase: true,
          trim: true
        },
        imageUrl: {
          type: String,
          trim: true
        }
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
    }
  },
  { timestamps: true }
);

function validateStoreItem(item) {
  const schema = {
    storeId: Joi.objectId().require(),
    itemId: Joi.objectId().required(),
    isActive: Joi.boolean(),
    sizesOffered: Joi.array()
      .unique()
      .items(
        Joi.string()
          .min(1)
          .required()
          .trim()
      ),
    category: Joi.string().trim(),
    name: Joi.string().trim(),
    code: Joi.string().trim(),
    number: Joi.string().trim(),
    images: Joi.array().items(
      Joi.object({
        imageUrl: Joi.string()
          .uri()
          .trim(),
        name: Joi.string().trim()
      })
    ),
    mandatoryItem: Joi.boolean(),
    price: Joi.number()
      .min(0)
      .required()
      .trim(),
    priceBreakGoal: Joi.number()
      .min(0)
      .trim()
  };
  return Joi.validate(item, schema, joiOptions);
}

function validateStoreItemEdit(item) {
  const schema = {
    isActive: Joi.boolean(),
    sizesOffered: Joi.array()
      .unique()
      .items(
        Joi.string()
          .min(1)
          .required()
          .trim()
      ),
    category: Joi.string().trim(),
    name: Joi.string().trim(),
    code: Joi.string().trim(),
    number: Joi.string().trim(),
    mandatory: Joi.boolean(),
    price: Joi.number()
      .min(0)
      .required()
      .trim(),
    priceBreakGoal: Joi.number()
      .min(0)
      .trim()
  };
  return Joi.validate(item, schema, joiOptions);
}

function validateStoreItemImage(image) {
  const schema = {
    imageUrl: Joi.string()
      .uri()
      .trim(),
    name: Joi.string().trim()
  };

  return Joi.validate(image, schema, joiOptions);
}

exports.StoreItem = mongoose.model('storeitems', StoreItemSchema);
exports.validateStoreItem = validateStoreItem;
exports.validateStoreItemEdit = validateStoreItemEdit;
exports.validateStoreItemImage = validateStoreItemImage;
