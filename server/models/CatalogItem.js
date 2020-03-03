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
    nameEN: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    nameFR: {
      type: String,
      trim: true,
      uppercase: true
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
        _id: false,
        type: String,
        trim: true,
        required: true,
        minlength: 1,
        uppercase: true
      }
    ],
    priceBreaks: {
      CAD: [
        {
          _id: false,
          priceBreak: {
            type: String
          },
          price: {
            type: Float
          }
        }
      ],
      USD: [
        {
          _id: false,
          priceBreak: {
            type: String
          },
          price: {
            type: Float
          }
        }
      ]
    },
    gender: {
      type: String,
      required: true,
      uppercase: true,
      trim: true
    },
    descriptionEN: {
      type: String,
      trim: true,
      required: true
    },
    descriptionFR: {
      type: String,
      trim: true
    },
    categories: [{ type: String, uppercase: true, trim: true }],
    categoriesFR: [{ type: String, uppercase: true, trim: true }],
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
    nameEN: Joi.string()
      .required()
      .trim(),
    nameFR: Joi.string()
      .allow('', null)
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
    gender: Joi.string()
      .required()
      .trim(),
    categories: Joi.array().items(
      Joi.string()
        .allow('', null)
        .trim()
    ),
    categoriesFR: Joi.array().items(
      Joi.string()
        .allow('', null)
        .trim()
    ),
    priceBreaks: Joi.object({
      CAD: Joi.array().items({ priceBreak: Joi.string(), price: Joi.number() }),
      USD: Joi.array().items({ priceBreak: Joi.string(), price: Joi.number() })
    }),
    descriptionEN: Joi.string()
      .required()
      .trim(),
    descriptionFR: Joi.string()
      .allow('', null)
      .trim(),
    images: Joi.array().items(
      Joi.string()
        .uri()
        .allow(null)
    )
  };
  return Joi.validate(catalogItem, schema, joiOptions);
}

function validateCatalogItemEdit(catalogItem) {
  const schema = {
    nameEN: Joi.string()
      .required()
      .trim(),
    nameFR: Joi.string()
      .allow('', null)
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
    gender: Joi.string()
      .required()
      .trim(),
    descriptionEN: Joi.string()
      .required()
      .trim(),
    descriptionFR: Joi.string()
      .trim()
      .allow('', null),
    categories: Joi.array().items({
      text: Joi.string()
        .allow('', null)
        .trim(),
      tiClasses: Joi.array()
    }),
    priceBreaks: Joi.object({
      CAD: Joi.array().items({ priceBreak: Joi.string(), price: Joi.number() }),
      USD: Joi.array().items({ priceBreak: Joi.string(), price: Joi.number() })
    }),
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
