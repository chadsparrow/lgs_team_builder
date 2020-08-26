const {
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
      password,
      contact: {
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
      },
      billingSame: true,
      billing: {
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
      },
      shippingSame: true,
      shipping: {
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
      },
    };
  });

  it('should return error if trimmed password becomes empty', () => {
    reqbody.password = '   ';
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

  it('should return error if password is not a string', () => {
    reqbody.password = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/password/);
  });

  it('should return error if password is less than 8 chars', () => {
    reqbody.password = charArray(8);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/password/);
  });

  // CONTACT

  it('should return error if contact.email is invalid', () => {
    reqbody.contact.email = 'x';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if contact.email is not provided', () => {
    delete reqbody.contact.email;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if contact.email is not a string', () => {
    reqbody.contact.email = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if contact.name is less than 5 chars', () => {
    reqbody.contact.name = charArray(5);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if trimmed contact.name is less than 5 chars', () => {
    reqbody.contact.name = ' 12 4 ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if contact.name is greater than 50 chars', () => {
    reqbody.contact.name = charArray(52);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if contact.name is not provided', () => {
    delete reqbody.contact.name;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if contact.name is not a string', () => {
    reqbody.contact.name = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if trimmed contact.name is empty', () => {
    reqbody.contact.name = '  ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if contact.company is not a string', () => {
    reqbody.contact.company = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/company/);
  });

  it('should return error if contact.address1 is not provided', () => {
    delete reqbody.contact.address1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if trimmed contact.address1 is empty', () => {
    reqbody.contact.address1 = '   ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if contact.address1 is not a string', () => {
    reqbody.contact.address1 = 2;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if contact.address2 is not a string', () => {
    reqbody.contact.address2 = 2;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address2/);
  });

  it('should return an error if contact.city is not provided', () => {
    delete reqbody.contact.city;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if trimmed contact.city is empty', () => {
    reqbody.contact.city = '  ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if contact.city is not a string', () => {
    reqbody.contact.city = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if contact.stateProv is less than 2 chars', () => {
    reqbody.contact.stateProv = charArray(2);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if trimmed contact.stateProv is less than 2 chars', () => {
    reqbody.contact.stateProv = ' 1 ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if contact.stateProv is not provided', () => {
    delete reqbody.contact.stateProv;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if trimmed contact.stateProv is empty', () => {
    reqbody.contact.stateProv = '   ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if contact.stateProv is not a string', () => {
    reqbody.contact.stateProv = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if contact.country is less than 2 chars', () => {
    reqbody.contact.country = charArray(2);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if trimmed contact.country is less than 2 chars', () => {
    reqbody.contact.country = ' 1 ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if contact.country is not provided', () => {
    delete reqbody.contact.country;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if trimmed contact.country is empty', () => {
    reqbody.contact.country = '   ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if contact.country is not a string', () => {
    reqbody.contact.country = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if contact.zipPostal is not provided', () => {
    delete reqbody.contact.zipPostal;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if trimmed contact.zipPostal is empty', () => {
    reqbody.contact.zipPostal = '   ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if contact.zipPostal is not a string', () => {
    reqbody.contact.zipPostal = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if contact.phone is not provided', () => {
    delete reqbody.contact.phone;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return an error if trimmed contact.phone is empty', () => {
    reqbody.contact.phone = '  ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return an error if contact.phone is not a string', () => {
    reqbody.contact.phone = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  // BILLING

  it('should return error if billingSame is invalid', () => {
    reqbody.billingSame = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/billingSame/);
  });

  it('should return error if billing.name is less than 5 chars', () => {
    reqbody.billing.name = charArray(5);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if trimmed billing.name is less than 5 chars', () => {
    reqbody.billing.name = ' 12 4 ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if billing.name is greater than 50 chars', () => {
    reqbody.billing.name = charArray(52);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if billing.name is not provided', () => {
    delete reqbody.billing.name;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if billing.name is not a string', () => {
    reqbody.billing.name = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if trimmed billing.name is empty', () => {
    reqbody.billing.name = '  ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if billing.company is not a string', () => {
    reqbody.billing.company = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/company/);
  });

  it('should return error if billing.address1 is not provided', () => {
    delete reqbody.billing.address1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if trimmed billing.address1 is empty', () => {
    reqbody.billing.address1 = '   ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if billing.address1 is not a string', () => {
    reqbody.billing.address1 = 2;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if billing.address2 is not a string', () => {
    reqbody.billing.address2 = 2;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address2/);
  });

  it('should return an error if billing.city is not provided', () => {
    delete reqbody.billing.city;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if trimmed billing.city is empty', () => {
    reqbody.billing.city = '  ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if billing.city is not a string', () => {
    reqbody.billing.city = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if billing.stateProv is less than 2 chars', () => {
    reqbody.billing.stateProv = charArray(2);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if trimmed billing.stateProv is less than 2 chars', () => {
    reqbody.billing.stateProv = ' 1 ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if billing.stateProv is not provided', () => {
    delete reqbody.billing.stateProv;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if trimmed billing.stateProv is empty', () => {
    reqbody.billing.stateProv = '   ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if billing.stateProv is not a string', () => {
    reqbody.billing.stateProv = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if billing.country is less than 2 chars', () => {
    reqbody.billing.country = charArray(2);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if trimmed billing.country is less than 2 chars', () => {
    reqbody.billing.country = ' 1 ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if billing.country is not provided', () => {
    delete reqbody.billing.country;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if trimmed billing.country is empty', () => {
    reqbody.billing.country = '   ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if billing.country is not a string', () => {
    reqbody.billing.country = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if billing.zipPostal is not provided', () => {
    delete reqbody.billing.zipPostal;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if trimmed billing.zipPostal is empty', () => {
    reqbody.billing.zipPostal = '   ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if billing.zipPostal is not a string', () => {
    reqbody.billing.zipPostal = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if billing.phone is not provided', () => {
    delete reqbody.billing.phone;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return an error if trimmed billing.phone is empty', () => {
    reqbody.billing.phone = '  ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return an error if billing.phone is not a string', () => {
    reqbody.billing.phone = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return error if billing.email is invalid', () => {
    reqbody.billing.email = 'x';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if billing.email is not provided', () => {
    delete reqbody.billing.email;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if billing.email is not a string', () => {
    reqbody.billing.email = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  // SHIPPING

  it('should return error if shippingSame is invalid', () => {
    reqbody.shippingSame = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/shippingSame/);
  });

  it('should return error if shipping.name is less than 5 chars', () => {
    reqbody.shipping.name = charArray(5);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if trimmed shipping.name is less than 5 chars', () => {
    reqbody.shipping.name = ' 12 4 ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if shipping.name is greater than 50 chars', () => {
    reqbody.shipping.name = charArray(52);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if shipping.name is not provided', () => {
    delete reqbody.shipping.name;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if shipping.name is not a string', () => {
    reqbody.shipping.name = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if trimmed shipping.name is empty', () => {
    reqbody.shipping.name = '  ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if shipping.company is not a string', () => {
    reqbody.shipping.company = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/company/);
  });

  it('should return error if shipping.address1 is not provided', () => {
    delete reqbody.shipping.address1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if trimmed shipping.address1 is empty', () => {
    reqbody.shipping.address1 = '   ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if shipping.address1 is not a string', () => {
    reqbody.shipping.address1 = 2;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if shipping.address2 is not a string', () => {
    reqbody.shipping.address2 = 2;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address2/);
  });

  it('should return an error if shipping.city is not provided', () => {
    delete reqbody.shipping.city;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if trimmed shipping.city is empty', () => {
    reqbody.shipping.city = '  ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if shipping.city is not a string', () => {
    reqbody.shipping.city = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if shipping.stateProv is less than 2 chars', () => {
    reqbody.shipping.stateProv = charArray(2);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if trimmed shipping.stateProv is less than 2 chars', () => {
    reqbody.shipping.stateProv = ' 1 ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if shipping.stateProv is not provided', () => {
    delete reqbody.shipping.stateProv;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if trimmed shipping.stateProv is empty', () => {
    reqbody.shipping.stateProv = '   ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if shipping.stateProv is not a string', () => {
    reqbody.shipping.stateProv = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if shipping.country is less than 2 chars', () => {
    reqbody.shipping.country = charArray(2);
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if trimmed shipping.country is less than 2 chars', () => {
    reqbody.shipping.country = ' 1 ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if shipping.country is not provided', () => {
    delete reqbody.shipping.country;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if trimmed shipping.country is empty', () => {
    reqbody.shipping.country = '   ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if shipping.country is not a string', () => {
    reqbody.shipping.country = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if shipping.zipPostal is not provided', () => {
    delete reqbody.shipping.zipPostal;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if trimmed shipping.zipPostal is empty', () => {
    reqbody.shipping.zipPostal = '   ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if shipping.zipPostal is not a string', () => {
    reqbody.shipping.zipPostal = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if shipping.phone is not provided', () => {
    delete reqbody.shipping.phone;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return an error if trimmed shipping.phone is empty', () => {
    reqbody.shipping.phone = '  ';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return an error if shipping.phone is not a string', () => {
    reqbody.shipping.phone = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return error if shipping.email is invalid', () => {
    reqbody.shipping.email = 'x';
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if shipping.email is not provided', () => {
    delete reqbody.shipping.email;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if shipping.email is not a string', () => {
    reqbody.shipping.email = 1;
    const result = validateNewRegister(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
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
      contact: {
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
      },
      billingSame: true,
      billing: {
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
      },
      shippingSame: true,
      shipping: {
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
      },
    };
  });

  it('should return error if email is invalid', () => {
    reqbody.contact.email = 'x';
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if email is not provided', () => {
    delete reqbody.contact.email;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if name is less than 5 chars', () => {
    reqbody.contact.name = charArray(5);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if name is greater than 50 chars', () => {
    reqbody.contact.name = charArray(52);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if name is not provided', () => {
    delete reqbody.contact.name;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return an error if address1 is less than 10 chars', () => {
    reqbody.contact.address1 = charArray(10);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if address1 is not provided', () => {
    delete reqbody.contact.address1;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return an error if city is not provided', () => {
    delete reqbody.contact.city;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if stateProv is less than 2 chars', () => {
    reqbody.contact.stateProv = charArray(2);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if stateProv is not provided', () => {
    delete reqbody.contact.stateProv;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if country is less than 2 chars', () => {
    reqbody.contact.country = charArray(2);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if country is not provided', () => {
    delete reqbody.contact.country;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if zipPostal is not provided', () => {
    delete reqbody.contact.zipPostal;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if phone is not provided', () => {
    delete reqbody.contact.phone;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return an error if shippingName is not provided', () => {
    delete reqbody.shipping.name;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return an error if shippingAddress1 is not provided', () => {
    delete reqbody.shipping.address1;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return an error if shippingCity is not provided', () => {
    delete reqbody.shipping.city;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if shippingStateProv is less than 2 chars', () => {
    reqbody.shipping.stateProv = charArray(2);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if shippingStateProv is not provided', () => {
    delete reqbody.shipping.stateProv;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if shippingCountry is less than 2 chars', () => {
    reqbody.shipping.country = charArray(2);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if shippingCountry is not provided', () => {
    delete reqbody.shipping.country;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if shippingPhone is not provided', () => {
    delete reqbody.shipping.phone;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return error if shippingEmail is invalid', () => {
    reqbody.shipping.email = 'x';
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if shippingEmail is not provided', () => {
    delete reqbody.shipping.email;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return an error if billingName is not provided', () => {
    delete reqbody.billing.name;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return an error if billingAddress1 is not provided', () => {
    delete reqbody.billing.address1;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return an error if billingCity is not provided', () => {
    delete reqbody.billing.city;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if billingStateProv is less than 2 chars', () => {
    reqbody.billing.stateProv = charArray(2);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if billingStateProv is not provided', () => {
    delete reqbody.billing.stateProv;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if billingCountry is less than 2 chars', () => {
    reqbody.billing.country = charArray(2);
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if billingCountry is not provided', () => {
    delete reqbody.billing.country;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if billingPhone is not provided', () => {
    delete reqbody.billing.phone;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return error if billingEmail is invalid', () => {
    reqbody.billing.email = 'x';
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if billingEmail is not provided', () => {
    delete reqbody.billing.email;
    const result = validateNewMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
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
      contact: {
        name,
        company,
        address1,
        address2,
        city,
        stateProv,
        country,
        zipPostal,
        phone,
      },
      billingSame: false,
      billing: {
        name,
        company,
        address1,
        address2,
        city,
        stateProv,
        country,
        zipPostal,
        phone,
        email,
      },
      shippingSame: false,
      shipping: {
        name,
        company,
        address1,
        address2,
        city,
        stateProv,
        country,
        zipPostal,
        phone,
        email,
      },
    };
  });

  it('should return error if name is less than 5 chars', () => {
    reqbody.contact.name = charArray(5);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if name is greater than 50 chars', () => {
    reqbody.contact.name = charArray(52);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return error if name is not provided', () => {
    delete reqbody.contact.name;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return an error if address1 is less than 10 chars', () => {
    reqbody.contact.address1 = charArray(10);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return error if address1 is not provided', () => {
    delete reqbody.contact.address1;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return an error if city is not provided', () => {
    delete reqbody.contact.city;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if stateProv is less than 2 chars', () => {
    reqbody.contact.stateProv = charArray(2);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if stateProv is not provided', () => {
    delete reqbody.contact.stateProv;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if country is less than 2 chars', () => {
    reqbody.contact.country = charArray(2);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if country is not provided', () => {
    delete reqbody.contact.country;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if zipPostal is not provided', () => {
    delete reqbody.contact.zipPostal;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/zipPostal/);
  });

  it('should return an error if phone is not provided', () => {
    delete reqbody.contact.phone;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return an error if shippingName is not provided', () => {
    delete reqbody.shipping.name;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return an error if shippingAddress1 is not provided', () => {
    delete reqbody.shipping.address1;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return an error if shippingCity is not provided', () => {
    delete reqbody.shipping.city;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if shippingStateProv is less than 2 chars', () => {
    reqbody.shipping.stateProv = charArray(2);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if shippingStateProv is not provided', () => {
    delete reqbody.shipping.stateProv;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if shippingCountry is less than 2 chars', () => {
    reqbody.shipping.country = charArray(2);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if shippingCountry is not provided', () => {
    delete reqbody.shipping.country;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if shippingPhone is not provided', () => {
    delete reqbody.shipping.phone;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return error if shippingEmail is invalid', () => {
    reqbody.shipping.email = 'x';
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if shippingEmail is not provided', () => {
    delete reqbody.shipping.email;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return an error if billingName is not provided', () => {
    delete reqbody.billing.name;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/name/);
  });

  it('should return an error if billingAddress1 is not provided', () => {
    delete reqbody.billing.address1;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/address1/);
  });

  it('should return an error if billingCity is not provided', () => {
    delete reqbody.billing.city;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/city/);
  });

  it('should return an error if billingStateProv is less than 2 chars', () => {
    reqbody.billing.stateProv = charArray(2);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if billingStateProv is not provided', () => {
    delete reqbody.billing.stateProv;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/stateProv/);
  });

  it('should return an error if billingCountry is less than 2 chars', () => {
    reqbody.billing.country = charArray(2);
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if billingCountry is not provided', () => {
    delete reqbody.billing.country;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/country/);
  });

  it('should return an error if billingPhone is not provided', () => {
    delete reqbody.billing.phone;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/phone/);
  });

  it('should return error if billingEmail is invalid', () => {
    reqbody.billing.email = 'x';
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return error if billingEmail is not provided', () => {
    delete reqbody.billing.email;
    const result = validateUpdateMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
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
