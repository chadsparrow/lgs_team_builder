const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const CatalogSchema = new mongoose.Schema({
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
    uppercase: true
  },
  image: {
    type: String
  }
});

function validateCatalog(catalog) {
  const schema = {
    brand: Joi.string()
      .required()
      .trim(),
    season: Joi.string()
      .required()
      .trim(),
    year: Joi.string()
      .required()
      .min(4)
      .max(4)
      .trim(),
    image: Joi.string().uri()
  };
  return Joi.validate(catalog, schema);
}

exports.Catalog = mongoose.model('catalogs', CatalogSchema);
exports.validateCatalog = validateCatalog;
