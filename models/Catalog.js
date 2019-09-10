const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const joiOptions = { abortEarly: true, language: { key: '{{key}} ' } };

const CatalogSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    season: {
      type: String,
      required: true,
      trim: true,
      uppercase: true
    },
    year: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 4,
      trim: true,
      match: /^\d{4}$/
    },
    coverImg: {
      type: String
    }
  },
  { timestamps: true }
);

function validateCatalog(catalog) {
  const schema = {
    brand: Joi.string()
      .required()
      .trim(),
    season: Joi.string()
      .required()
      .trim()
      .uppercase()
      .valid(['SPRING/SUMMER', 'FALL/WINTER', 'SPRING', 'SUMMER', 'FALL', 'WINTER']),
    year: Joi.string()
      .required()
      .regex(/^\d{4}$/)
      .min(4)
      .max(4)
      .trim(),
    coverImg: Joi.string().uri()
  };
  return Joi.validate(catalog, schema, joiOptions);
}

function validateCoverImage(image) {
  const schema = {
    coverImg: Joi.string()
      .uri()
      .required()
  };
  return Joi.validate(image, schema, joiOptions);
}

exports.Catalog = mongoose.model('catalogs', CatalogSchema);
exports.validateCatalog = validateCatalog;
exports.validateCoverImage = validateCoverImage;
