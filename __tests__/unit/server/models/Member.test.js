const {
  Member,
  validateNewRegister,
  validateNewMember,
  validateUpdateMember,
  validateEmail,
  validatePassword,
  validateNotification,
  validateLogin,
  validateForgotEmail,
  validatePasswordReset,
} = require('../../../../server/models/Member');

const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const email = faker.internet.email();
const newEmail = faker.internet.email();
const password = faker.internet.password(8);
const name = `${faker.name.firstName()} ${faker.name.lastName()}`;
const company = faker.company.companyName();
const address1 = faker.address.streetAddress();
const address2 = faker.address.secondaryAddress();
const city = faker.address.city();
const stateProv = faker.address.stateAbbr();
const country = faker.address.countryCode();
const zipPostal = faker.address.zipCode();
const phone = faker.phone.phoneNumber();

let reqbody;
const charArray = function (num) {
  return new Array(num).join('a');
};

describe('validateNewRegister function', () => {
  beforeEach(() => {
    reqbody = {
      email,
      password,
      name,
      company,
      address1,
      address2,
      city,
      stateProv,
      country,
      zipPostal,
      phone,
      shippingSame: true,
      shippingName: name,
      shippingCompany: company,
      shippingAddress1: address1,
      shippingAddress2: address2,
      shippingCity: city,
      shippingStateProv: stateProv,
      shippingCountry: country,
      shippingZipPostal: zipPostal,
      shippingPhone: phone,
      shippingEmail: email,
      billingSame: true,
      billingName: name,
      billingCompany: company,
      billingAddress1: address1,
      billingAddress2: address2,
      billingCity: city,
      billingStateProv: stateProv,
      billingCountry: country,
      billingZipPostal: zipPostal,
      billingPhone: phone,
      billingEmail: email,
    };
  });

  it('should return error if email is invalid', () => {
    reqbody.email = 'x';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if email is not provided', () => {
    delete reqbody.email;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if password is less than 8 chars', () => {
    reqbody.password = charArray(8);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/password/);
  });

  it('should return error if password is not provided', () => {
    delete reqbody.password;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/password/);
  });

  it('should return error if name is less than 5 chars', () => {
    reqbody.name = charArray(5);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if name is greater than 50 chars', () => {
    reqbody.name = charArray(52);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if name is not provided', () => {
    delete reqbody.name;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return an error if address1 is less than 10 chars', () => {
    reqbody.address1 = charArray(10);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if address1 is not provided', () => {
    delete reqbody.address1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return an error if city is not provided', () => {
    delete reqbody.city;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if stateProv is less than 2 chars', () => {
    reqbody.stateProv = charArray(2);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if stateProv is not provided', () => {
    delete reqbody.stateProv;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if country is less than 2 chars', () => {
    reqbody.country = charArray(2);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if country is not provided', () => {
    delete reqbody.country;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if zipPostal is not provided', () => {
    delete reqbody.zipPostal;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if phone is not provided', () => {
    delete reqbody.phone;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return an error if shippingName is not provided', () => {
    delete reqbody.shippingName;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingName/);
  });

  it('should return an error if shippingAddress1 is not provided', () => {
    delete reqbody.shippingAddress1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingAddress1/);
  });

  it('should return an error if shippingCity is not provided', () => {
    delete reqbody.shippingCity;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingCity/);
  });

  it('should return an error if shippingStateProv is less than 2 chars', () => {
    reqbody.shippingStateProv = charArray(2);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingStateProv/);
  });

  it('should return an error if shippingStateProv is not provided', () => {
    delete reqbody.shippingStateProv;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingStateProv/);
  });

  it('should return an error if shippingCountry is less than 2 chars', () => {
    reqbody.shippingCountry = charArray(2);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingCountry/);
  });

  it('should return an error if shippingCountry is not provided', () => {
    delete reqbody.shippingCountry;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingCountry/);
  });

  it('should return an error if shippingPhone is not provided', () => {
    delete reqbody.shippingPhone;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingPhone/);
  });

  it('should return error if shippingEmail is invalid', () => {
    reqbody.shippingEmail = 'x';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingEmail/);
  });

  it('should return error if shippingEmail is not provided', () => {
    delete reqbody.shippingEmail;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingEmail/);
  });

  it('should return an error if billingName is not provided', () => {
    delete reqbody.billingName;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingName/);
  });

  it('should return an error if billingAddress1 is not provided', () => {
    delete reqbody.billingAddress1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingAddress1/);
  });

  it('should return an error if billingCity is not provided', () => {
    delete reqbody.billingCity;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingCity/);
  });

  it('should return an error if billingStateProv is less than 2 chars', () => {
    reqbody.billingStateProv = charArray(2);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingStateProv/);
  });

  it('should return an error if billingStateProv is not provided', () => {
    delete reqbody.billingStateProv;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingStateProv/);
  });

  it('should return an error if billingCountry is less than 2 chars', () => {
    reqbody.billingCountry = charArray(2);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingCountry/);
  });

  it('should return an error if billingCountry is not provided', () => {
    delete reqbody.billingCountry;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingCountry/);
  });

  it('should return an error if billingPhone is not provided', () => {
    delete reqbody.billingPhone;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingPhone/);
  });

  it('should return error if billingEmail is invalid', () => {
    reqbody.billingEmail = 'x';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingEmail/);
  });

  it('should return error if billingEmail is not provided', () => {
    delete reqbody.billingEmail;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingEmail/);
  });

  // HAPPY PATH
  it('should return validated body if req.body is valid', () => {
    const result = validateNewRegister(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});

describe('validateNewMember function', () => {
  beforeEach(() => {
    reqbody = {
      email,
      name,
      company,
      address1,
      address2,
      city,
      stateProv,
      country,
      zipPostal,
      phone,
      shippingSame: true,
      shippingName: name,
      shippingCompany: company,
      shippingAddress1: address1,
      shippingAddress2: address2,
      shippingCity: city,
      shippingStateProv: stateProv,
      shippingCountry: country,
      shippingZipPostal: zipPostal,
      shippingPhone: phone,
      shippingEmail: email,
      billingSame: true,
      billingName: name,
      billingCompany: company,
      billingAddress1: address1,
      billingAddress2: address2,
      billingCity: city,
      billingStateProv: stateProv,
      billingCountry: country,
      billingZipPostal: zipPostal,
      billingPhone: phone,
      billingEmail: email,
    };
  });

  it('should return error if email is invalid', () => {
    reqbody.email = 'x';
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if email is not provided', () => {
    delete reqbody.email;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if name is less than 5 chars', () => {
    reqbody.name = charArray(5);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if name is greater than 50 chars', () => {
    reqbody.name = charArray(52);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if name is not provided', () => {
    delete reqbody.name;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return an error if address1 is less than 10 chars', () => {
    reqbody.address1 = charArray(10);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if address1 is not provided', () => {
    delete reqbody.address1;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return an error if city is not provided', () => {
    delete reqbody.city;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if stateProv is less than 2 chars', () => {
    reqbody.stateProv = charArray(2);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if stateProv is not provided', () => {
    delete reqbody.stateProv;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if country is less than 2 chars', () => {
    reqbody.country = charArray(2);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if country is not provided', () => {
    delete reqbody.country;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if zipPostal is not provided', () => {
    delete reqbody.zipPostal;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if phone is not provided', () => {
    delete reqbody.phone;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return an error if shippingName is not provided', () => {
    delete reqbody.shippingName;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingName/);
  });

  it('should return an error if shippingAddress1 is not provided', () => {
    delete reqbody.shippingAddress1;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingAddress1/);
  });

  it('should return an error if shippingCity is not provided', () => {
    delete reqbody.shippingCity;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingCity/);
  });

  it('should return an error if shippingStateProv is less than 2 chars', () => {
    reqbody.shippingStateProv = charArray(2);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingStateProv/);
  });

  it('should return an error if shippingStateProv is not provided', () => {
    delete reqbody.shippingStateProv;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingStateProv/);
  });

  it('should return an error if shippingCountry is less than 2 chars', () => {
    reqbody.shippingCountry = charArray(2);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingCountry/);
  });

  it('should return an error if shippingCountry is not provided', () => {
    delete reqbody.shippingCountry;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingCountry/);
  });

  it('should return an error if shippingPhone is not provided', () => {
    delete reqbody.shippingPhone;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingPhone/);
  });

  it('should return error if shippingEmail is invalid', () => {
    reqbody.shippingEmail = 'x';
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingEmail/);
  });

  it('should return error if shippingEmail is not provided', () => {
    delete reqbody.shippingEmail;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingEmail/);
  });

  it('should return an error if billingName is not provided', () => {
    delete reqbody.billingName;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingName/);
  });

  it('should return an error if billingAddress1 is not provided', () => {
    delete reqbody.billingAddress1;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingAddress1/);
  });

  it('should return an error if billingCity is not provided', () => {
    delete reqbody.billingCity;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingCity/);
  });

  it('should return an error if billingStateProv is less than 2 chars', () => {
    reqbody.billingStateProv = charArray(2);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingStateProv/);
  });

  it('should return an error if billingStateProv is not provided', () => {
    delete reqbody.billingStateProv;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingStateProv/);
  });

  it('should return an error if billingCountry is less than 2 chars', () => {
    reqbody.billingCountry = charArray(2);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingCountry/);
  });

  it('should return an error if billingCountry is not provided', () => {
    delete reqbody.billingCountry;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingCountry/);
  });

  it('should return an error if billingPhone is not provided', () => {
    delete reqbody.billingPhone;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingPhone/);
  });

  it('should return error if billingEmail is invalid', () => {
    reqbody.billingEmail = 'x';
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingEmail/);
  });

  it('should return error if billingEmail is not provided', () => {
    delete reqbody.billingEmail;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingEmail/);
  });

  // HAPPY PATH
  it('should return validated body if req.body is valid', () => {
    const result = validateNewMember(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});

describe('validateUpdateMember function', () => {
  beforeEach(() => {
    reqbody = {
      name,
      company,
      address1,
      address2,
      city,
      stateProv,
      country,
      zipPostal,
      phone,
      shippingSame: false,
      shippingName: name,
      shippingCompany: company,
      shippingAddress1: address1,
      shippingAddress2: address2,
      shippingCity: city,
      shippingStateProv: stateProv,
      shippingCountry: country,
      shippingZipPostal: zipPostal,
      shippingPhone: phone,
      shippingEmail: email,
      billingSame: false,
      billingName: name,
      billingCompany: company,
      billingAddress1: address1,
      billingAddress2: address2,
      billingCity: city,
      billingStateProv: stateProv,
      billingCountry: country,
      billingZipPostal: zipPostal,
      billingPhone: phone,
      billingEmail: email,
    };
  });

  it('should return error if name is less than 5 chars', () => {
    reqbody.name = charArray(5);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if name is greater than 50 chars', () => {
    reqbody.name = charArray(52);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if name is not provided', () => {
    delete reqbody.name;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return an error if address1 is less than 10 chars', () => {
    reqbody.address1 = charArray(10);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if address1 is not provided', () => {
    delete reqbody.address1;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return an error if city is not provided', () => {
    delete reqbody.city;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if stateProv is less than 2 chars', () => {
    reqbody.stateProv = charArray(2);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if stateProv is not provided', () => {
    delete reqbody.stateProv;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if country is less than 2 chars', () => {
    reqbody.country = charArray(2);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if country is not provided', () => {
    delete reqbody.country;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if zipPostal is not provided', () => {
    delete reqbody.zipPostal;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if phone is not provided', () => {
    delete reqbody.phone;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return an error if shippingName is not provided', () => {
    delete reqbody.shippingName;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingName/);
  });

  it('should return an error if shippingAddress1 is not provided', () => {
    delete reqbody.shippingAddress1;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingAddress1/);
  });

  it('should return an error if shippingCity is not provided', () => {
    delete reqbody.shippingCity;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingCity/);
  });

  it('should return an error if shippingStateProv is less than 2 chars', () => {
    reqbody.shippingStateProv = charArray(2);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingStateProv/);
  });

  it('should return an error if shippingStateProv is not provided', () => {
    delete reqbody.shippingStateProv;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingStateProv/);
  });

  it('should return an error if shippingCountry is less than 2 chars', () => {
    reqbody.shippingCountry = charArray(2);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingCountry/);
  });

  it('should return an error if shippingCountry is not provided', () => {
    delete reqbody.shippingCountry;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingCountry/);
  });

  it('should return an error if shippingPhone is not provided', () => {
    delete reqbody.shippingPhone;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingPhone/);
  });

  it('should return error if shippingEmail is invalid', () => {
    reqbody.shippingEmail = 'x';
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingEmail/);
  });

  it('should return error if shippingEmail is not provided', () => {
    delete reqbody.shippingEmail;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingEmail/);
  });

  it('should return an error if billingName is not provided', () => {
    delete reqbody.billingName;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingName/);
  });

  it('should return an error if billingAddress1 is not provided', () => {
    delete reqbody.billingAddress1;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingAddress1/);
  });

  it('should return an error if billingCity is not provided', () => {
    delete reqbody.billingCity;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingCity/);
  });

  it('should return an error if billingStateProv is less than 2 chars', () => {
    reqbody.billingStateProv = charArray(2);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingStateProv/);
  });

  it('should return an error if billingStateProv is not provided', () => {
    delete reqbody.billingStateProv;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingStateProv/);
  });

  it('should return an error if billingCountry is less than 2 chars', () => {
    reqbody.billingCountry = charArray(2);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingCountry/);
  });

  it('should return an error if billingCountry is not provided', () => {
    delete reqbody.billingCountry;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingCountry/);
  });

  it('should return an error if billingPhone is not provided', () => {
    delete reqbody.billingPhone;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingPhone/);
  });

  it('should return error if billingEmail is invalid', () => {
    reqbody.billingEmail = 'x';
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingEmail/);
  });

  it('should return error if billingEmail is not provided', () => {
    delete reqbody.billingEmail;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingEmail/);
  });

  // HAPPY PATH
  it('should return validated body data if req.body is valid', () => {
    const result = validateUpdateMember(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});

describe('validateEmail function', () => {
  beforeEach(() => {
    reqbody = {
      currentEmail: email,
      newEmail,
      confirmEmail: newEmail,
    };
  });

  it('should return an error if currentEmail is not provided', () => {
    delete reqbody.currentEmail;
    const result = validateEmail(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/currentEmail/);
  });

  it('should return an error if currentEmail is not a valid email', () => {
    reqbody.currentEmail = 'x';
    const result = validateEmail(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/currentEmail/);
  });

  it('should return an error if newEmail is not provided', () => {
    delete reqbody.newEmail;
    const result = validateEmail(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/newEmail/);
  });

  it('should return an error if newEmail is not a valid email', () => {
    reqbody.newEmail = 'x';
    const result = validateEmail(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/newEmail/);
  });

  it('should return an error if newEmail matches currentEmail', () => {
    reqbody.newEmail = email;
    const result = validateEmail(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/newEmail/);
  });

  it('should return an error if confirmEmail is not provided', () => {
    delete reqbody.confirmEmail;
    const result = validateEmail(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/confirmEmail/);
  });

  it('should return an error if confirmEmail is not a valid email', () => {
    reqbody.confirmEmail = 'x';
    const result = validateEmail(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/confirmEmail/);
  });

  it('should return an error if confirmEmail does not match newEmail', () => {
    reqbody.confirmEmail = 'x@y.com';
    const result = validateEmail(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/confirmEmail/);
  });

  // HAPPY PATH
  it('should return validated body data if req.body is valid', () => {
    const result = validateEmail(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});

describe('validatePassword function', () => {
  beforeEach(() => {
    const newPassword = faker.internet.password();
    reqbody = {
      oldPassword: password,
      newPassword,
      confirmPassword: newPassword,
    };
  });

  it('should return an error if oldPassword is not provided', () => {
    delete reqbody.oldPassword;
    const result = validatePassword(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/oldPassword/);
  });

  it('should return an error if oldPassword is less than 8 chars', () => {
    reqbody.oldPassword = charArray(8);
    const result = validatePassword(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/oldPassword/);
  });

  it('should return an error if newPassword is not provided', () => {
    delete reqbody.newPassword;
    const result = validatePassword(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/newPassword/);
  });

  it('should return an error if newPassword is less than 8 chars', () => {
    reqbody.newPassword = charArray(8);
    const result = validatePassword(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/newPassword/);
  });

  it('should return an error if newPassword matches oldPassword', () => {
    reqbody.newPassword = reqbody.oldPassword;
    const result = validatePassword(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/newPassword/);
  });

  it('should return an error if confirmPassword is not provided', () => {
    delete reqbody.confirmPassword;
    const result = validatePassword(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/confirmPassword/);
  });

  it('should return an error if confirmPassword is less than 8 chars', () => {
    reqbody.confirmPassword = charArray(8);
    const result = validatePassword(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/confirmPassword/);
  });

  it('should return an error if confirmPassword does not match newPassword', () => {
    reqbody.confirmPassword = faker.internet.password();
    const result = validatePassword(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/confirmPassword/);
  });

  // HAPPY PATH
  it('should return validated body data if req.body is valid', () => {
    const result = validatePassword(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});

describe('validateNotification function', () => {
  beforeEach(() => {
    reqbody = {
      recipients: [mongoose.Types.ObjectId().toHexString()],
      message: 'Test',
      clickTo: 'TestURL',
    };
  });

  it('should return an error if recipients is not provided', () => {
    delete reqbody.recipients;
    const result = validateNotification(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/recipients/);
  });

  it('should return an error if recipients array is empty', () => {
    reqbody.recipients = [];
    const result = validateNotification(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if recipients array passes invalid objectID', () => {
    reqbody.recipients = ['x'];
    const isValid = mongoose.Types.ObjectId.isValid(reqbody.recipients[0]);
    expect(isValid).toBeFalsy();
  });

  it('should return an error if recipients array passes objectId that is not a string', () => {
    reqbody.recipients = [mongoose.Types.ObjectId()];
    const result = validateNotification(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if message is not provided', () => {
    delete reqbody.message;
    const result = validateNotification(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/message/);
  });

  it('should return an error if message is an empty string', () => {
    reqbody.message = '';
    const result = validateNotification(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if clickTo is not a string', () => {
    reqbody.clickTo = 1;
    const result = validateNotification(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/clickTo/);
  });

  // HAPPY PATH
  it('should return validated body data if req.body is valid', () => {
    const result = validateNotification(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});

describe('validateLogin function', () => {
  beforeEach(() => {
    reqbody = {
      email,
      password,
    };
  });

  it('should return an error if email is not provided', () => {
    delete reqbody.email;
    const result = validateLogin(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return an error if email is not a proper email', () => {
    reqbody.email = charArray(8);
    const result = validateLogin(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return an error if email is not a string', () => {
    reqbody.email = 1;
    const result = validateLogin(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if password is not provided', () => {
    delete reqbody.password;
    const result = validateLogin(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/password/);
  });

  it('should return an error if password is not a string', () => {
    reqbody.password = 1;
    const result = validateLogin(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if password is less than 8 chars', () => {
    reqbody.password = charArray(8);
    const result = validateLogin(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/password/);
  });

  // HAPPY PATH
  it('should return validated body data if req.body is valid', () => {
    const result = validateLogin(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});

describe('validateForgotEmail function', () => {
  beforeEach(() => {
    reqbody = {
      email,
    };
  });

  it('should return an error if email is not provided', () => {
    delete reqbody.email;
    const result = validateForgotEmail(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return an error if email is not a string', () => {
    reqbody.email = 1;
    const result = validateForgotEmail(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if email is not a proper email', () => {
    reqbody.email = charArray(8);
    const result = validateForgotEmail(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  // HAPPY PATH
  it('should return validated body data if req.body is valid', () => {
    const result = validateForgotEmail(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});

describe('validatePasswordReset function', () => {
  beforeEach(() => {
    const newPassword = faker.internet.password();
    reqbody = {
      password: newPassword,
      confirmPassword: newPassword,
    };
  });

  it('should return an error if password is not provided', () => {
    delete reqbody.password;
    const result = validatePasswordReset(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/password/);
  });

  it('should return an error if password is not a string', () => {
    reqbody.password = 1;
    const result = validatePasswordReset(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if password is less than 8 chars', () => {
    reqbody.password = charArray(8);
    const result = validatePasswordReset(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/password/);
  });

  it('should return an error if password matches oldPassword', () => {
    reqbody.password = reqbody.oldPassword;
    const result = validatePasswordReset(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/password/);
  });

  it('should return an error if confirmPassword is not provided', () => {
    delete reqbody.confirmPassword;
    const result = validatePasswordReset(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/confirmPassword/);
  });

  it('should return an error if confirmPassword is not a string', () => {
    reqbody.confirmPassword = 1;
    const result = validatePasswordReset(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if confirmPassword does not match password', () => {
    reqbody.confirmPassword = faker.internet.password();
    const result = validatePasswordReset(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/confirmPassword/);
  });

  // HAPPY PATH
  it('should return validated body data if req.body is valid', () => {
    const result = validatePasswordReset(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});
