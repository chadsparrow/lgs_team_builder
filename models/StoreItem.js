const mongoose = require('mongoose');
const Float = require('mongoose-float');
const Joi = require('@hapi/joi');

const StoreItemSchema = mongoose.Schema(
  {
    store_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stores'
    },
    item_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'catalogitems'
    },
    survey_likes: {
      type: Number,
      default: 0
    },
    survey_qty: {
      type: Number,
      default: 0
    },
    is_active: {
      type: Boolean,
      default: true
    },
    sizes_offered: [
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
        image_url: {
          type: String,
          trim: true
        }
      }
    ],
    mandatory: {
      type: Boolean,
      default: false
    },
    price: {
      type: Float,
      default: 0.0,
      required: true
    }
  },
  { timestamps: true }
);

function validateStoreItem(item) {
  const schema = {
    store_id: Joi.objectId().require(),
    item_id: Joi.objectId().required(),
    is_active: Joi.boolean(),
    sizes_offered: Joi.array()
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
        image_url: Joi.string()
          .uri()
          .trim(),
        name: Joi.string().trim()
      })
    ),
    mandatory: Joi.boolean(),
    price: Joi.number()
      .min(0)
      .required()
      .trim()
  };
  return Joi.validate(item, schema);
}

function validateStoreItemEdit(item) {
  const schema = {
    is_active: Joi.boolean(),
    sizes_offered: Joi.array()
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
      .trim()
  };
  return Joi.validate(item, schema);
}

function validateStoreItemImage(image) {
  const schema = {
    image_url: Joi.string()
      .uri()
      .trim(),
    name: Joi.string().trim()
  };

  return Joi.validate(image, schema);
}

exports.StoreItem = mongoose.model('storeitems', StoreItemSchema);
exports.validateStoreItem = validateStoreItem;
exports.validateStoreItemEdit = validateStoreItemEdit;
exports.validateStoreItemImage = validateStoreItemImage;
