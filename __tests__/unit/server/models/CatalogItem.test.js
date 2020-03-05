/**
 * @jest-environment node
 */

const mongoose = require('mongoose');
const {
  validateCatalogItem,
  validateCatalogItemEdit,
  validateCatalogImg
} = require('../../../../server/models/CatalogItem');

let reqbody;

describe('validateCatalogItem function', () => {
  beforeEach(() => {
    reqbody = {
      catalogId: mongoose.Types.ObjectId().toHexString(),
      nameEN: 'item1',
      nameFR: 'item1',
      productCode: 'prodcode',
      styleCode: 'stylecode',
      sizes: ['S'],
      gender: 'M',
      categories: ['Biking'],
      categoriesFR: ['BikingFR'],
      priceBreaks: {
        CAD: [{ priceBreak: '1', price: 5 }],
        USD: [{ priceBreak: '1', price: 4 }]
      },
      descriptionEN: 'description',
      descriptionFR: 'descriptionFR',
      images: ['http://image.website.com']
    };
  });

  it('should return an error if catalogId is not provided', () => {
    delete reqbody.catalogId;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if catalogId is not a valid ObjectId', () => {
    reqbody.catalogId = 'a';
    expect(mongoose.Types.ObjectId.isValid(reqbody.catalogId)).toBeFalsy();
  });

  it('should return an error if catalogId is not a string', () => {
    reqbody.catalogId = mongoose.Types.ObjectId;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if nameEN is not provided', () => {
    delete reqbody.nameEN;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if nameEN is not a string', () => {
    reqbody.nameEN = 1;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if nameFR is not a string', () => {
    reqbody.nameFR = 1;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if productCode is not provided', () => {
    delete reqbody.productCode;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if productCode is not a string', () => {
    reqbody.productCode = 1;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if productCode is an empty string', () => {
    reqbody.productCode = '';
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if styleCode is not provided', () => {
    delete reqbody.styleCode;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if styleCode is not a string', () => {
    reqbody.styleCode = 1;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if styleCode is an empty string', () => {
    reqbody.styleCode = '';
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if sizes is not an array', () => {
    reqbody.sizes = '';
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/array/);
  });

  it('should return an error if sizes array is empty', () => {
    reqbody.sizes = [];
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if sizes array element is not a string', () => {
    reqbody.sizes = [1];
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if sizes array element is an empty string', () => {
    reqbody.sizes = [''];
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if gender is not provided', () => {
    delete reqbody.gender;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if gender is not a string', () => {
    reqbody.gender = 1;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if gender is an empty string', () => {
    reqbody.gender = '';
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if categories is not an array', () => {
    reqbody.categories = '';
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/array/);
  });

  it('should return an error if categories element is not a string', () => {
    reqbody.categories = [1];
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if categoriesFR is not an array', () => {
    reqbody.categoriesFR = '';
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/array/);
  });

  it('should return an error if categoriesFR element is not a string', () => {
    reqbody.categoriesFR = [1];
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if priceBreaks is not an object', () => {
    reqbody.priceBreaks = '';
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/object/);
  });

  it('should return an error if priceBreaks object does not have CAD or USD array', () => {
    reqbody.priceBreaks = {};
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if priceBreaksCAD or USD is not an array', () => {
    reqbody.priceBreaks = { CAD: '' };
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/array/);
  });

  it('should return an error if priceBreaksCAD/USD arrays are empty', () => {
    reqbody.priceBreaks = { CAD: [], USD: [] };
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if priceBreaksCAD/USD arrays are not objects', () => {
    reqbody.priceBreaks = { CAD: [''], USD: [''] };
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/object/);
  });

  it('should return an error if priceBreaksCAD/USD arrays objects do not include priceBreak', () => {
    reqbody.priceBreaks = { CAD: [{ price: 1 }], USD: [{ price: 1 }] };
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if priceBreaksCAD/USD arrays objects do not include price', () => {
    reqbody.priceBreaks = {
      CAD: [{ priceBreak: '1' }],
      USD: [{ priceBreak: '1' }]
    };
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if priceBreaksCAD/USD arrays objects priceBreak is not a string', () => {
    reqbody.priceBreaks = {
      CAD: [{ priceBreak: 1, price: 1 }],
      USD: [{ priceBreak: 1, price: 1 }]
    };
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if priceBreaksCAD/USD arrays objects priceBreak is an empty string', () => {
    reqbody.priceBreaks = {
      CAD: [{ priceBreak: '', price: 1 }],
      USD: [{ priceBreak: '', price: 1 }]
    };
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if priceBreaksCAD/USD arrays objects price is not a number', () => {
    reqbody.priceBreaks = {
      CAD: [{ priceBreak: '1', price: 'a' }],
      USD: [{ priceBreak: '1', price: 'a' }]
    };
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/number/);
  });

  it('should return an error if priceBreaksCAD/USD arrays objects price is an empty string', () => {
    reqbody.priceBreaks = {
      CAD: [{ priceBreak: '1', price: '' }],
      USD: [{ priceBreak: '1', price: '' }]
    };
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/number/);
  });

  it('should return an error if descriptionEN is not provided', () => {
    delete reqbody.descriptionEN;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if descriptionEN is not a string', () => {
    reqbody.descriptionEN = 1;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if descriptionFR is not a string', () => {
    reqbody.descriptionFR = 1;
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if images is not a an array', () => {
    reqbody.images = '';
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/array/);
  });

  it('should return an error if images array element is not a string', () => {
    reqbody.images = [1];
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if images array element is not a valid URI', () => {
    reqbody.images = ['a'];
    const result = validateCatalogItem(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/uri/);
  });

  // HAPPY PATH
  it('should return validated body if req.body is valid', () => {
    const result = validateCatalogItem(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});

describe('validateCatalogItemEdit function', () => {
  beforeEach(() => {
    reqbody = {
      nameEN: 'item1',
      nameFR: 'item1',
      productCode: 'prodcode',
      styleCode: 'stylecode',
      sizes: ['S'],
      gender: 'M',
      categories: ['Biking'],
      categoriesFR: ['BikingFR'],
      priceBreaks: {
        CAD: [{ priceBreak: '1', price: 5 }],
        USD: [{ priceBreak: '1', price: 4 }]
      },
      descriptionEN: 'description',
      descriptionFR: 'descriptionFR',
      images: ['http://image.website.com'],
      isActive: true
    };
  });

  it('should return an error if nameEN is not provided', () => {
    delete reqbody.nameEN;
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if nameEN is not a string', () => {
    reqbody.nameEN = 1;
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if nameFR is not a string', () => {
    reqbody.nameFR = 1;
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if productCode is not provided', () => {
    delete reqbody.productCode;
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if productCode is not a string', () => {
    reqbody.productCode = 1;
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if productCode is an empty string', () => {
    reqbody.productCode = '';
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if styleCode is not provided', () => {
    delete reqbody.styleCode;
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if styleCode is not a string', () => {
    reqbody.styleCode = 1;
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if styleCode is an empty string', () => {
    reqbody.styleCode = '';
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if sizes is not an array', () => {
    reqbody.sizes = '';
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/array/);
  });

  it('should return an error if sizes array is empty', () => {
    reqbody.sizes = [];
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if sizes array element is not a string', () => {
    reqbody.sizes = [1];
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if sizes array element is an empty string', () => {
    reqbody.sizes = [''];
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if gender is not provided', () => {
    delete reqbody.gender;
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if gender is not a string', () => {
    reqbody.gender = 1;
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if gender is an empty string', () => {
    reqbody.gender = '';
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if categories is not an array', () => {
    reqbody.categories = '';
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/array/);
  });

  it('should return an error if categories element is not a string', () => {
    reqbody.categories = [1];
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if categoriesFR is not an array', () => {
    reqbody.categoriesFR = '';
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/array/);
  });

  it('should return an error if categoriesFR element is not a string', () => {
    reqbody.categoriesFR = [1];
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if priceBreaks is not an object', () => {
    reqbody.priceBreaks = '';
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/object/);
  });

  it('should return an error if priceBreaks object does not have CAD or USD array', () => {
    reqbody.priceBreaks = {};
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if priceBreaksCAD or USD is not an array', () => {
    reqbody.priceBreaks = { CAD: '' };
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/array/);
  });

  it('should return an error if priceBreaksCAD/USD arrays are empty', () => {
    reqbody.priceBreaks = { CAD: [], USD: [] };
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if priceBreaksCAD/USD arrays are not objects', () => {
    reqbody.priceBreaks = { CAD: [''], USD: [''] };
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/object/);
  });

  it('should return an error if priceBreaksCAD/USD arrays objects do not include priceBreak', () => {
    reqbody.priceBreaks = { CAD: [{ price: 1 }], USD: [{ price: 1 }] };
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if priceBreaksCAD/USD arrays objects do not include price', () => {
    reqbody.priceBreaks = {
      CAD: [{ priceBreak: '1' }],
      USD: [{ priceBreak: '1' }]
    };
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if priceBreaksCAD/USD arrays objects priceBreak is not a string', () => {
    reqbody.priceBreaks = {
      CAD: [{ priceBreak: 1, price: 1 }],
      USD: [{ priceBreak: 1, price: 1 }]
    };
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if priceBreaksCAD/USD arrays objects priceBreak is an empty string', () => {
    reqbody.priceBreaks = {
      CAD: [{ priceBreak: '', price: 1 }],
      USD: [{ priceBreak: '', price: 1 }]
    };
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if priceBreaksCAD/USD arrays objects price is not a number', () => {
    reqbody.priceBreaks = {
      CAD: [{ priceBreak: '1', price: 'a' }],
      USD: [{ priceBreak: '1', price: 'a' }]
    };
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/number/);
  });

  it('should return an error if priceBreaksCAD/USD arrays objects price is an empty string', () => {
    reqbody.priceBreaks = {
      CAD: [{ priceBreak: '1', price: '' }],
      USD: [{ priceBreak: '1', price: '' }]
    };
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/number/);
  });

  it('should return an error if descriptionEN is not provided', () => {
    delete reqbody.descriptionEN;
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if descriptionEN is not a string', () => {
    reqbody.descriptionEN = 1;
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if descriptionFR is not a string', () => {
    reqbody.descriptionFR = 1;
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if images is not a an array', () => {
    reqbody.images = '';
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/array/);
  });

  it('should return an error if images array element is not a string', () => {
    reqbody.images = [1];
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if images array element is not a valid URI', () => {
    reqbody.images = ['a'];
    const result = validateCatalogItemEdit(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/uri/);
  });

  // HAPPY PATH
  it('should return validated body if req.body is valid', () => {
    const result = validateCatalogItemEdit(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});

describe('validateCatalogImg function', () => {
  beforeEach(() => {
    reqbody = {
      imageUrl: 'http://image.web.com'
    };
  });

  it('should return an error if imageUrl is not provided', () => {
    delete reqbody.imageUrl;
    const result = validateCatalogImg(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if imageUrl is not a string', () => {
    reqbody.imageUrl = 1;
    const result = validateCatalogImg(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if imageUrl is an empty string', () => {
    reqbody.imageUrl = '';
    const result = validateCatalogImg(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if imageUrl is not a valid URI', () => {
    reqbody.imageUrl = 'a';
    const result = validateCatalogImg(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/uri/);
  });

  // HAPPY PATH
  it('should return validated body if req.body is valid', () => {
    const result = validateCatalogImg(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});
