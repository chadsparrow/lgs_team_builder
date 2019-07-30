const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const Float = require('mongoose-float').loadType(mongoose);

const CatalogItemSchema = new mongoose.Schema({
  catalog_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'catalogs'
  },
  name: {
    type: String,
    required: true,
    minlength: 5,
    trim: true
  },
  product_code: {
    type: String,
    required: true,
    trim: true,
    uppercase: true
  },
  style_code: {
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
      minlength: 1
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
  images: [{ type: String, trim: true }]
});

function validateCatalogItem(catalogItem) {
  const schema = {
    catalog_id: Joi.objectId().required(),
    name: Joi.string()
      .min(5)
      .required()
      .trim(),
    product_code: Joi.string()
      .required()
      .trim(),
    style_code: Joi.string()
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
    images: Joi.array().items(Joi.string().uri())
  };
  return Joi.validate(catalogItem, schema);
}

exports.CatalogItem = mongoose.model('catalogitems', CatalogItemSchema);
exports.validateCatalogItem = validateCatalogItem;
