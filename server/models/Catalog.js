const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const joi_options = { abortEarly: false, language: { key: '{{key}} ' } };

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
      enum: ['SPRING/SUMMER', 'FALL/WINTER', 'SPRING', 'SUMMER', 'FALL', 'WINTER'],
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
    cover_img: {
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
      .valid(['spring/summer', 'fall/winter', 'spring', 'summer', 'fall', 'winter']),
    year: Joi.string()
      .required()
      .regex(/^\d{4}$/)
      .min(4)
      .max(4)
      .trim(),
    cover_img: Joi.string().uri()
  };
  return Joi.validate(catalog, schema, joi_options);
}

function validateCoverImage(image) {
  const schema = {
    cover_img: Joi.string()
      .uri()
      .required()
  };
  return Joi.validate(image, schema, joi_options);
}

exports.Catalog = mongoose.model('catalogs', CatalogSchema);
exports.validateCatalog = validateCatalog;
exports.validateCoverImage = validateCoverImage;
