/**
 * @jest-environment node
 */

const mongoose = require('mongoose');
const { validateTeam, validateAddMember } = require('../../../../server/models/Team');
const faker = require('faker');

let reqbody;

describe('validateTeam function', () => {
  beforeEach(() => {
    reqbody = {
      name: faker.company.companyName(),
      logo: faker.image.imageUrl(),
      adminId: mongoose.Types.ObjectId().toHexString(),
      managerId: mongoose.Types.ObjectId().toHexString(),
      teamId: '123456',
      contactName: faker.name.firstName(),
      contactCompany: faker.company.companyName(),
      contactAddress1: faker.address.streetAddress(),
      contactAddress2: faker.address.secondaryAddress(),
      contactCity: faker.address.city(),
      contactStateProv: faker.address.stateAbbr(),
      contactCountry: faker.address.countryCode(),
      contactZipPostal: faker.address.zipCode(),
      contactPhone: faker.phone.phoneNumber(),
      contactEmail: faker.internet.email(),
      shippingName: faker.name.firstName(),
      shippingCompany: faker.company.companyName(),
      shippingAddress1: faker.address.streetAddress(),
      shippingAddress2: faker.address.secondaryAddress(),
      shippingCity: faker.address.city(),
      shippingStateProv: faker.address.stateAbbr(),
      shippingCountry: faker.address.countryCode(),
      shippingZipPostal: faker.address.zipCode(),
      shippingPhone: faker.phone.phoneNumber(),
      shippingEmail: faker.internet.email(),
    };
  });

  it('should return an error if name is not provided', () => {
    delete reqbody.name;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if name is not a string', () => {
    reqbody.name = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if name is an empty string', () => {
    reqbody.name = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if logo is not a string', () => {
    reqbody.logo = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if logo is not a valid URI', () => {
    reqbody.logo = 'a';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/uri/);
  });

  it('should return an error if adminId is not provided', () => {
    delete reqbody.adminId;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if adminId is not valid objectId', () => {
    reqbody.adminId = 'a';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/pattern/);
  });

  it('should return an error if adminId is not string', () => {
    reqbody.adminId = mongoose.Types.ObjectId();
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if managerId is not valid objectId', () => {
    reqbody.managerId = 'a';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/pattern/);
  });

  it('should return an error if managerId is not string', () => {
    reqbody.managerId = mongoose.Types.ObjectId();
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if teamId is not string', () => {
    reqbody.teamId = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if contactName is not provided', () => {
    delete reqbody.contactName;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if contactName is not a string', () => {
    reqbody.contactName = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if contactName is an empty string', () => {
    reqbody.contactName = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if contactCompany is not a string', () => {
    reqbody.contactCompany = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if contactAddress1 is not provided', () => {
    delete reqbody.contactAddress1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if contactAddress1 is not a string', () => {
    reqbody.contactAddress1 = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if contactAddress1 is an empty string', () => {
    reqbody.contactAddress1 = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if contactAddress2 is not a string', () => {
    reqbody.contactAddress2 = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if contactCity is not provided', () => {
    delete reqbody.contactCity;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if contactCity is not a string', () => {
    reqbody.contactCity = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if contactCity is an empty string', () => {
    reqbody.contactCity = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if contactStateProv is not provided', () => {
    delete reqbody.contactStateProv;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if contactStateProv is not a string', () => {
    reqbody.contactStateProv = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if contactStateProv is an empty string', () => {
    reqbody.contactStateProv = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if contactStateProv is not at least 2 chars', () => {
    reqbody.contactStateProv = '1';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/2/);
  });

  it('should return an error if contactCountry is not provided', () => {
    delete reqbody.contactCountry;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if contactCountry is not a string', () => {
    reqbody.contactCountry = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if contactCountry is an empty string', () => {
    reqbody.contactCountry = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if contactCountry is not 2 chars', () => {
    reqbody.contactCountry = 'a';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/2/);
  });

  it('should return an error if contactZipPostal is not provided', () => {
    delete reqbody.contactZipPostal;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if contactZipPostal is not a string', () => {
    reqbody.contactZipPostal = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if contactZipPostal is an empty string', () => {
    reqbody.contactZipPostal = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if contactPhone is not provided', () => {
    delete reqbody.contactPhone;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if contactPhone is not a string', () => {
    reqbody.contactPhone = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if contactPhone is an empty string', () => {
    reqbody.contactPhone = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if contactEmail is not provided', () => {
    delete reqbody.contactEmail;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if contactEmail is not a string', () => {
    reqbody.contactEmail = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if contactEmail is an empty string', () => {
    reqbody.contactEmail = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if contactEmail is not a valid email', () => {
    reqbody.contactEmail = 'a';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  it('should return an error if shippingName is not provided', () => {
    delete reqbody.shippingName;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if shippingName is not a string', () => {
    reqbody.shippingName = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if shippingName is an empty string', () => {
    reqbody.shippingName = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if shippingCompany is not a string', () => {
    reqbody.shippingCompany = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if shippingAddress1 is not provided', () => {
    delete reqbody.shippingAddress1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if shippingAddress1 is not a string', () => {
    reqbody.shippingAddress1 = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if shippingAddress1 is an empty string', () => {
    reqbody.shippingAddress1 = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if shippingAddress2 is not a string', () => {
    reqbody.shippingAddress2 = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if shippingCity is not provided', () => {
    delete reqbody.shippingCity;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if shippingCity is not a string', () => {
    reqbody.shippingCity = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if shippingCity is an empty string', () => {
    reqbody.shippingCity = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if shippingStateProv is not provided', () => {
    delete reqbody.shippingStateProv;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if shippingStateProv is not a string', () => {
    reqbody.shippingStateProv = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if shippingStateProv is an empty string', () => {
    reqbody.shippingStateProv = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if shippingStateProv is not at least 2 chars', () => {
    reqbody.shippingStateProv = '1';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/2/);
  });

  it('should return an error if shippingCountry is not provided', () => {
    delete reqbody.shippingCountry;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if shippingCountry is not a string', () => {
    reqbody.shippingCountry = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if shippingCountry is an empty string', () => {
    reqbody.shippingCountry = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if shippingCountry is not 2 chars', () => {
    reqbody.shippingCountry = 'a';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/2/);
  });

  it('should return an error if shippingZipPostal is not provided', () => {
    delete reqbody.shippingZipPostal;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if shippingZipPostal is not a string', () => {
    reqbody.shippingZipPostal = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if shippingZipPostal is an empty string', () => {
    reqbody.shippingZipPostal = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if shippingPhone is not provided', () => {
    delete reqbody.shippingPhone;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if shippingPhone is not a string', () => {
    reqbody.shippingPhone = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if shippingPhone is an empty string', () => {
    reqbody.shippingPhone = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if shippingEmail is not provided', () => {
    delete reqbody.shippingEmail;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if shippingEmail is not a string', () => {
    reqbody.shippingEmail = 1;
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  it('should return an error if shippingEmail is an empty string', () => {
    reqbody.shippingEmail = '';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if shippingEmail is not a valid email', () => {
    reqbody.shippingEmail = 'a';
    const result = validateTeam(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/email/);
  });

  // HAPPY PATH
  it('should return validated body if req.body is valid', () => {
    const result = validateTeam(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});

describe('validateAddMember function', () => {
  beforeEach(() => {
    reqbody = {
      memberId: mongoose.Types.ObjectId().toHexString(),
    };
  });

  it('should return an error if memberId is not provided', () => {
    delete reqbody.memberId;
    const result = validateAddMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/required/);
  });

  it('should return an error if memberId is not a valid objectId', () => {
    reqbody.memberId = 'a';
    const result = validateAddMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/pattern/);
  });

  it('should return an error if memberId is not an empty string', () => {
    reqbody.memberId = '';
    const result = validateAddMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/empty/);
  });

  it('should return an error if memberId is not a string', () => {
    reqbody.memberId = mongoose.Types.ObjectId();
    const result = validateAddMember(reqbody);
    expect(result.error).toBeTruthy();
    expect(result.error.details[0].message).toMatch(/string/);
  });

  // HAPPY PATH
  it('should return validated body if req.body is valid', () => {
    const result = validateAddMember(reqbody);
    expect(result.value).toBeTruthy();
    expect(result.value).toEqual(reqbody);
    expect(result.error).toBe(null);
  });
});
