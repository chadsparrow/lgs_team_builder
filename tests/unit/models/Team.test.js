const { validateTeamName, validateAddMember, validateTeam } = require('../../../models/Team');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
let validRequest;
let char;

beforeAll(() => {
  char = 'a';
});

afterAll(() => {
  validRequest = null;
  char = null;
});

describe('Joi validateTeamName()', () => {
  beforeEach(() => {
    validRequest = { name: 'Team Name' };
  });
  describe('req.body.name', () => {
    it('should return an error if it is not a string', () => {
      validRequest.name = 1;
      const { error } = validateTeamName(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if it is empty', () => {
      validRequest.name = '';
      const { error } = validateTeamName(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if it is not provided', () => {
      delete validRequest.name;
      const { error } = validateTeamName(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/required/);
    });
  });

  it('should not return an error if it is validated', () => {
    const { error } = validateTeamName(validRequest);
    expect(error).toBe(null);
  });
});

describe('Joi validateAddMember()', () => {
  beforeEach(() => {
    validRequest = { id: new mongoose.Types.ObjectId().toHexString() };
  });

  describe('req.body.id', () => {
    it('should return an error if it is not a string', () => {
      validRequest.id = 1;
      const { error } = validateAddMember(validRequest);
      expect(error.message).toMatch(/id/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if it is empty', () => {
      validRequest.id = '';
      const { error } = validateAddMember(validRequest);
      expect(error.message).toMatch(/id/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if it is not provided', () => {
      delete validRequest.id;
      const { error } = validateAddMember(validRequest);
      expect(error.message).toMatch(/id/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if it is not a valid objectId', () => {
      validRequest.id = 'aaaaaaaaaaa';
      const { error } = validateAddMember(validRequest);
      expect(error.message).toMatch(/id/);
      expect(error.message).toMatch(/pattern/);
    });
  });

  it('should not return an error if it is validated', () => {
    const { error } = validateAddMember(validRequest);
    expect(error).toBe(null);
  });
});

describe('Joi validateTeam()', () => {
  beforeEach(() => {
    validRequest = {
      logo: 'http://image.com/image',
      admin_id: new mongoose.Types.ObjectId().toHexString(),
      manager_id: new mongoose.Types.ObjectId().toHexString(),
      useManagerDetails: false,
      contact_name: char.repeat(5),
      contact_address1: char.repeat(10),
      contact_address2: char.repeat(10),
      contact_city: 'city',
      contact_state_prov: char.repeat(2),
      contact_country: char.repeat(2),
      contact_zip_postal: '90210',
      contact_phone: '1234567',
      contact_email: 'email@email.com',
      bulk_use_above_details: false,
      bulk_contact_name: char.repeat(5),
      bulk_contact_address1: char.repeat(10),
      bulk_contact_address2: char.repeat(10),
      bulk_contact_city: 'city',
      bulk_contact_state_prov: char.repeat(2),
      bulk_contact_country: char.repeat(2),
      bulk_contact_zip_postal: '90210',
      bulk_contact_phone: '1234567',
      bulk_contact_email: 'email@email.com'
    };
  });

  describe('req.body.logo', () => {
    it('should return an error if it is provided and not a string', () => {
      validRequest.logo = 1;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/logo/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if it is provided and not a valid URI', () => {
      validRequest.logo = 'a';
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/logo/);
      expect(error.message).toMatch(/valid uri/);
    });

    it('should not return an error if it is empty', () => {
      validRequest.logo = '';
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });

    it('should not return an error if it is not provided', () => {
      delete validRequest.logo;
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });
  });

  describe('req.body.admin_id', () => {
    it('should return an error if it not provided', () => {
      delete validRequest.admin_id;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/admin_id/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if it is not a string', () => {
      validRequest.admin_id = 1;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/admin_id/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if it is empty', () => {
      validRequest.admin_id = '';
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/admin_id/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if it is not a valid ObjectId', () => {
      validRequest.admin_id = 'aaaaaaaaa';
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/admin_id/);
      expect(error.message).toMatch(/pattern/);
    });
  });

  describe('req.body.manager_id', () => {
    it('should return an error if it not provided', () => {
      delete validRequest.manager_id;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/manager_id/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if it is not a string', () => {
      validRequest.manager_id = 1;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/manager_id/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if it is empty', () => {
      validRequest.manager_id = '';
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/manager_id/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if it is not a valid ObjectId', () => {
      validRequest.manager_id = 'aaaaaaaaa';
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/manager_id/);
      expect(error.message).toMatch(/pattern/);
    });
  });

  describe('req.body.useManagerDetails', () => {
    it('should return an error if it not a boolean', () => {
      validRequest.useManagerDetails = 1;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/useManagerDetails/);
      expect(error.message).toMatch(/boolean/);
    });

    it('should return an error if it not provided', () => {
      delete validRequest.useManagerDetails;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/useManagerDetails/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe('req.body.contact_name', () => {
    it('should return an error if useManagerDetails == false and is not provided', () => {
      validRequest.useManagerDetails = false;
      delete validRequest.contact_name;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_name/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if useManagerDetails == false and is not a string', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_name = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_name/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if useManagerDetails == false and is not at least 5 characters', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_name = char.repeat(4);
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_name/);
      expect(error.message).toMatch(/5/);
    });

    it('should return an error if useManagerDetails == false and it is more than 50 characters', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_name = char.repeat(51);
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_name/);
      expect(error.message).toMatch(/50/);
    });

    it('should not return an error if userManagerDetails == true and it not provided', () => {
      validRequest.useManagerDetails = true;
      delete validRequest.contact_name;
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });
  });

  describe('req.body.contact_address1', () => {
    it('should return an error if useManagerDetails == false and is not provided', () => {
      validRequest.useManagerDetails = false;
      delete validRequest.contact_address1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_address1/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if useManagerDetails == false and is not a string', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_address1 = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_address1/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if useManagerDetails == false and is not at least 10 characters', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_address1 = char.repeat(9);
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_address1/);
      expect(error.message).toMatch(/10/);
    });

    it('should return not return an error if useManagerDetails == true and it is not provided', () => {
      validRequest.useManagerDetails = true;
      delete validRequest.contact_address1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe('req.body.contact_address2', () => {
    it('should return an error if useManagerDetails == false and is not a string', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_address2 = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_address2/);
      expect(error.message).toMatch(/string/);
    });

    it('should not return an error if useManagerDetails == false and it is empty', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_address2 = '';
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error).toBe(null);
    });

    it('should not return an error if useManagerDetails == false and it is not provided', () => {
      validRequest.useManagerDetails = false;
      delete validRequest.contact_address2;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error).toBe(null);
    });

    it('should not return an error if useManagerDetails == true and it is not provided', () => {
      validRequest.useManagerDetails = true;
      delete validRequest.contact_address2;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe('req.body.contact_city', () => {
    it('should return an error if useManagerDetails == false and it is not a string', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_city = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_city/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if useManagerDetails == false and it is empty', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_city = '';
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_city/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if useManagerDetails == false and it is empty', () => {
      validRequest.useManagerDetails = false;
      delete validRequest.contact_city;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_city/);
      expect(error.message).toMatch(/required/);
    });

    it('should not return an error if useManagerDetails == true and it is not provided', () => {
      validRequest.useManagerDetails = true;
      delete validRequest.contact_city;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe('req.body.contact_state_prov', () => {
    it('should return an error if useManagerDetails == false and it is not a string', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_state_prov = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_state_prov/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if useManagerDetails == false and it is empty', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_state_prov = '';
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_state_prov/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if useManagerDetails == false and it is less than 2 characters', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_state_prov = char.repeat(1);
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_state_prov/);
      expect(error.message).toMatch(/2/);
    });

    it('should return an error if useManagerDetails == false and it is empty', () => {
      validRequest.useManagerDetails = false;
      delete validRequest.contact_state_prov;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_state_prov/);
      expect(error.message).toMatch(/required/);
    });

    it('should not return an error if useManagerDetails == true and it is not provided', () => {
      validRequest.useManagerDetails = true;
      delete validRequest.contact_state_prov;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe('req.body.contact_country', () => {
    it('should return an error if useManagerDetails == false and it is not a string', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_country = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_country/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if useManagerDetails == false and it is empty', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_country = '';
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_country/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if useManagerDetails == false and it is less than 2 characters', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_country = char.repeat(1);
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_country/);
      expect(error.message).toMatch(/2/);
    });

    it('should return an error if useManagerDetails == false and it is empty', () => {
      validRequest.useManagerDetails = false;
      delete validRequest.contact_country;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_country/);
      expect(error.message).toMatch(/required/);
    });

    it('should not return an error if useManagerDetails == true and it is not provided', () => {
      validRequest.useManagerDetails = true;
      delete validRequest.contact_country;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe('req.body.contact_zip_postal', () => {
    it('should return an error if useManagerDetails == false and it is not a string', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_zip_postal = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_zip_postal/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if useManagerDetails == false and it is empty', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_zip_postal = '';
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_zip_postal/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if useManagerDetails == false and it is empty', () => {
      validRequest.useManagerDetails = false;
      delete validRequest.contact_zip_postal;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_zip_postal/);
      expect(error.message).toMatch(/required/);
    });

    it('should not return an error if useManagerDetails == true and it is not provided', () => {
      validRequest.useManagerDetails = true;
      delete validRequest.contact_zip_postal;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe('req.body.contact_phone', () => {
    it('should return an error if userManagerDetails == false and it is not provided', () => {
      validRequest.useManagerDetails = false;
      delete validRequest.contact_phone;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_phone/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if userManagerDetails == false and it is not a string', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_phone = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_phone/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if userManagerDetails == false and it does not match regex /^[0-9]{7,10}$/', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_phone = 'a';
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_phone/);
      expect(error.message).toMatch(/pattern/);
    });

    it('should return an error if userManagerDetails == true and it does not match regex /^[0-9]{7,10}$/', () => {
      validRequest.useManagerDetails = true;
      delete validRequest.contact_phone;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe('req.body.contact_email', () => {
    it('should return an error if userManagerDetails == false and it is not provided', () => {
      validRequest.useManagerDetails = false;
      delete validRequest.contact_email;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_email/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if userManagerDetails == false and it is not a string', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_email = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_email/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if userManagerDetails == false and it is not a valid email', () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_email = 'email@';
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_email/);
      expect(error.message).toMatch(/valid email/);
    });

    it('should return an error if userManagerDetails == true and it does not match regex /^[0-9]{7,10}$/', () => {
      validRequest.useManagerDetails = true;
      delete validRequest.contact_email;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe('req.body.bulk_use_above_details', () => {
    it('should return an error if it not a boolean', () => {
      validRequest.bulk_use_above_details = 1;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/bulk_use_above_details/);
      expect(error.message).toMatch(/boolean/);
    });

    it('should return an error if it not provided', () => {
      delete validRequest.bulk_use_above_details;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/bulk_use_above_details/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe('req.body.bulk_contact_name', () => {
    it('should return an error if bulk_use_above_details == false and is not provided', () => {
      validRequest.bulk_use_above_details = false;
      delete validRequest.bulk_contact_name;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_name/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if bulk_use_above_details == false and is not a string', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_name = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_name/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if bulk_use_above_details == false and is not at least 5 characters', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_name = char.repeat(4);
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_name/);
      expect(error.message).toMatch(/5/);
    });

    it('should return an error if bulk_use_above_details == false and it is more than 50 characters', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_name = char.repeat(51);
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_name/);
      expect(error.message).toMatch(/50/);
    });

    it('should not return an error if userManagerDetails == true and it is not provided', () => {
      validRequest.bulk_use_above_details = true;
      delete validRequest.bulk_contact_name;
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });
  });

  describe('req.body.bulk_contact_address1', () => {
    it('should return an error if bulk_use_above_details == false and is not provided', () => {
      validRequest.bulk_use_above_details = false;
      delete validRequest.bulk_contact_address1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_address1/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if bulk_use_above_details == false and is not a string', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_address1 = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_address1/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if bulk_use_above_details == false and is not at least 5 characters', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_address1 = char.repeat(9);
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_address1/);
      expect(error.message).toMatch(/10/);
    });

    it('should not return an error if userManagerDetails == true and it is not provided', () => {
      validRequest.bulk_use_above_details = true;
      delete validRequest.bulk_contact_address1;
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });
  });

  describe('req.body.bulk_contact_address2', () => {
    it('should not return an error if bulk_use_above_details == false and is not provided', () => {
      validRequest.bulk_use_above_details = false;
      delete validRequest.bulk_contact_address2;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error).toBe(null);
    });

    it('should return an error if bulk_use_above_details == false and is not a string', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_address2 = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_address2/);
      expect(error.message).toMatch(/string/);
    });

    it('should not return an error if bulk_use_above_details == false and is empty', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_address2 = '';
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error).toBe(null);
    });

    it('should not return an error if userManagerDetails == true and it is not provided', () => {
      validRequest.bulk_use_above_details = true;
      delete validRequest.bulk_contact_address2;
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });
  });

  describe('req.body.bulk_contact_city', () => {
    it('should return an error if bulk_use_above_details == false and is not a string', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_city = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_city/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if bulk_use_above_details == false and it is empty', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_city = '';
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_city/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if bulk_use_above_details == false and it is not provided', () => {
      validRequest.bulk_use_above_details = false;
      delete validRequest.bulk_contact_city;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_city/);
      expect(error.message).toMatch(/required/);
    });

    it('should not return an error if userManagerDetails == true and it is not provided', () => {
      validRequest.bulk_use_above_details = true;
      delete validRequest.bulk_contact_city;
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });
  });

  describe('req.body.bulk_contact_state_prov', () => {
    it('should return an error if bulk_use_above_details == false and is not a string', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_state_prov = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_state_prov/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if bulk_use_above_details == false and it is empty', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_state_prov = '';
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_state_prov/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if bulk_use_above_details == false and it is not provided', () => {
      validRequest.bulk_use_above_details = false;
      delete validRequest.bulk_contact_state_prov;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_state_prov/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if bulk_use_above_details == false and it is less than 2 characters', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_state_prov = char.repeat(1);
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_state_prov/);
      expect(error.message).toMatch(/2/);
    });

    it('should not return an error if userManagerDetails == true and it is not provided', () => {
      validRequest.bulk_use_above_details = true;
      delete validRequest.bulk_contact_state_prov;
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });
  });

  describe('req.body.bulk_contact_country', () => {
    it('should return an error if bulk_use_above_details == false and is not a string', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_country = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_country/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if bulk_use_above_details == false and it is empty', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_country = '';
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_country/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if bulk_use_above_details == false and it is not provided', () => {
      validRequest.bulk_use_above_details = false;
      delete validRequest.bulk_contact_country;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_country/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if bulk_use_above_details == false and it is less than 2 characters', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_country = char.repeat(1);
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_country/);
      expect(error.message).toMatch(/2/);
    });

    it('should not return an error if userManagerDetails == true and it is not provided', () => {
      validRequest.bulk_use_above_details = true;
      delete validRequest.bulk_contact_country;
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });
  });

  describe('req.body.bulk_contact_zip_postal', () => {
    it('should return an error if bulk_use_above_details == false and is not a string', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_zip_postal = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_zip_postal/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if bulk_use_above_details == false and it is empty', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_zip_postal = '';
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_zip_postal/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if bulk_use_above_details == false and it is not provided', () => {
      validRequest.bulk_use_above_details = false;
      delete validRequest.bulk_contact_zip_postal;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_zip_postal/);
      expect(error.message).toMatch(/required/);
    });

    it('should not return an error if userManagerDetails == true and it is not provided', () => {
      validRequest.bulk_use_above_details = true;
      delete validRequest.bulk_contact_zip_postal;
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });
  });

  describe('req.body.bulk_contact_email', () => {
    it('should return an error if bulk_use_above_details == false and is not a string', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_email = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_email/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if bulk_use_above_details == false and it is empty', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_email = '';
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_email/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if bulk_use_above_details == false and it is not provided', () => {
      validRequest.bulk_use_above_details = false;
      delete validRequest.bulk_contact_email;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_email/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if bulk_use_above_details == false and it is not a valid email', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_email = 'email@';
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_email/);
      expect(error.message).toMatch(/valid email/);
    });

    it('should not return an error if userManagerDetails == true and it is not provided', () => {
      validRequest.bulk_use_above_details = true;
      delete validRequest.bulk_contact_email;
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });
  });

  describe('req.body.bulk_contact_phone', () => {
    it('should return an error if bulk_use_above_details == false and is not a string', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_phone = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_phone/);
      expect(error.message).toMatch(/string/);
    });

    it('should return an error if bulk_use_above_details == false and it is empty', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_phone = '';
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_phone/);
      expect(error.message).toMatch(/empty/);
    });

    it('should return an error if bulk_use_above_details == false and it is not provided', () => {
      validRequest.bulk_use_above_details = false;
      delete validRequest.bulk_contact_phone;
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_phone/);
      expect(error.message).toMatch(/required/);
    });

    it('should return an error if bulk_use_above_details == false and it does not match pattern /^[0-9]{7,10}$/', () => {
      validRequest.bulk_use_above_details = false;
      validRequest.bulk_contact_phone = 'a';
      const { error } = validateTeam(validRequest);
      expect(validRequest.bulk_use_above_details).toBe(false);
      expect(error.message).toMatch(/bulk_contact_phone/);
      expect(error.message).toMatch(/pattern/);
    });

    it('should not return an error if userManagerDetails == true and it is not provided', () => {
      validRequest.bulk_use_above_details = true;
      delete validRequest.bulk_contact_phone;
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });
  });

  it('should not return an error if it is validated', () => {
    const { error } = validateTeam(validRequest);
    expect(error).toBe(null);
  });
});
