/**
 * @jest-environment node
 */

const mongoose = require('mongoose');
const { validateStore } = require('../../../../server/models/Store');

let reqbody;

const charArray = function(num) {
  return new Array(num).join('a');
};

describe('validateStore function', () => {
  beforeEach(() => {
    reqbody = {
      teamId: mongoose.Types.ObjectId().toHexString(),
      storeName: 'name',
      storeCountry: 'country',
      currency: 'CAD',
      brand: 'SUGOI',
      refOrder: '12345678',
      adminId: mongoose.Types.ObjectId().toHexString(),
      managerId: mongoose.Types.ObjectId().toHexString(),
      mode: 'SURVEY',
      openingDate: new Date(),
      closingDate: new Date(),
      timezone: 'America/Vancouver',
      storeMessage: 'message',
      shippingType: 'BULK'
    };
  });

  it('should return an error if teamId is not provided', () => {
    delete reqbody.teamId;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if teamId is not a valid objectId', () => {
    reqbody.teamId = 'a';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/pattern/);
  });

  it('should return an error if teamId is not a string', () => {
    reqbody.teamId = mongoose.Types.ObjectId();
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if teamId is an empty string', () => {
    reqbody.teamId = '';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if storeName is not provided', () => {
    delete reqbody.storeName;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if storeName is not a string', () => {
    reqbody.storeName = 1;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if storeName is an empty string', () => {
    reqbody.storeName = '';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if storeCountry is not provided', () => {
    delete reqbody.storeCountry;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if storeCountry is not a string', () => {
    reqbody.storeCountry = 1;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if storeCountry is an empty string', () => {
    reqbody.storeCountry = '';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if brand is not provided', () => {
    delete reqbody.brand;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if brand is not a string', () => {
    reqbody.brand = 1;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if brand is an empty string', () => {
    reqbody.brand = '';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if brand is not in enum array', () => {
    reqbody.brand = 'NOTINARRAY';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/brand/);
  });

  it('should return an error if refOrder is not provided', () => {
    delete reqbody.refOrder;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if refOrder is not a string', () => {
    reqbody.refOrder = 1;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if refOrder is an empty string', () => {
    reqbody.refOrder = '';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if adminId is not provided', () => {
    delete reqbody.adminId;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if adminId is not a valid objectId', () => {
    reqbody.adminId = 'a';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/pattern/);
  });

  it('should return an error if adminId is not a string', () => {
    reqbody.adminId = mongoose.Types.ObjectId();
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if adminId is an empty string', () => {
    reqbody.adminId = '';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if managerId is not provided', () => {
    delete reqbody.managerId;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if managerId is not a valid objectId', () => {
    reqbody.managerId = 'a';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/pattern/);
  });

  it('should return an error if managerId is not a string', () => {
    reqbody.managerId = mongoose.Types.ObjectId();
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if managerId is an empty string', () => {
    reqbody.managerId = '';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if openingDate is not a date', () => {
    reqbody.openingDate = 'a';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/date/);
  });

  it('should return an error if closingDate is not a date', () => {
    reqbody.closingDate = 'a';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/date/);
  });

  it('should return an error if timezone is not provided', () => {
    delete reqbody.timezone;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if timezone is not a string', () => {
    reqbody.timezone = 1;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if timezone is an empty string', () => {
    reqbody.timezone = '';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if storeMessage is not a string', () => {
    reqbody.storeMessage = 1;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if storeMessage is larger than 255 chars', () => {
    reqbody.storeMessage = charArray(257);
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/255/);
  });

  it('should return an error if shippingType is not provided', () => {
    delete reqbody.shippingType;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if shippingType is not a string', () => {
    reqbody.shippingType = 1;
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if shippingType is an empty string', () => {
    reqbody.shippingType = '';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if shippingType is not in enum array', () => {
    reqbody.shippingType = 'NOTINARRAY';
    const result = validateStore(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingType/);
  });

  // HAPPY PATH
  it('should return validated body if req.body is valid', () => {
    const result = validateStore(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});
