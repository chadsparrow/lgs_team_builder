const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const Float = require('mongoose-float').loadType(mongoose);

const joiOptions = { abortEarly: true, language: { key: '{{key}} ' } };

const CatalogItemSchema = new mongoose.Schema(
  {
    catalogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'catalogs'
    },
    name: {
      type: String,
      required: true,
      minlength: 5,
      trim: true
    },
    productCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    styleCode: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    sizes: [
      {
        type: String,
        trim: true,
        required: true,
        minlength: 1,
        uppercase: true,
        unique: true
      }
    ],
    price: {
      type: Float,
      required: true,
      min: 0.0
    },
    gender: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    images: [{ type: String, trim: true }],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

function validateCatalogItem(catalogItem) {
  const schema = {
    catalogId: Joi.objectId().required(),
    name: Joi.string()
      .min(5)
      .required()
      .trim(),
    productCode: Joi.string()
      .required()
      .trim(),
    styleCode: Joi.string()
      .required()
      .trim(),
    sizes: Joi.array()
      .required()
      .min(1)
      .items(
        Joi.string()
          .required()
          .min(1)
          .trim()
      ),
    price: Joi.number()
      .required()
      .min(0),
    gender: Joi.string()
      .required()
      .trim(),
    description: Joi.string().trim(),
    category: Joi.string()
      .required()
      .trim(),
    images: Joi.array().items(Joi.string().uri()),
    isActive: Joi.boolean()
  };
  return Joi.validate(catalogItem, schema, joiOptions);
}

function validateCatalogItemEdit(catalogItem) {
  const schema = {
    name: Joi.string()
      .min(5)
      .required()
      .trim(),
    productCode: Joi.string()
      .required()
      .trim(),
    styleCode: Joi.string()
      .required()
      .trim(),
    sizes: Joi.array()
      .required()
      .min(1)
      .items(
        Joi.string()
          .required()
          .min(1)
          .trim()
      ),
    price: Joi.number()
      .required()
      .min(0),
    gender: Joi.string()
      .required()
      .trim(),
    description: Joi.string().trim(),
    category: Joi.string()
      .required()
      .trim(),
    images: Joi.array().items(Joi.string().uri()),
    isActive: Joi.boolean()
  };
  return Joi.validate(catalogItem, schema, joiOptions);
}

function validateCatalogImg(image) {
  const schema = {
    imageUrl: Joi.string()
      .uri()
      .required()
  };
  return Joi.validate(image, schema, joiOptions);
}

exports.CatalogItem = mongoose.model('catalogitems', CatalogItemSchema);
exports.validateCatalogItem = validateCatalogItem;
exports.validateCatalogItemEdit = validateCatalogItemEdit;
exports.validateCatalogImg = validateCatalogImg;
