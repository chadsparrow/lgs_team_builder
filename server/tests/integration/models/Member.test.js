const { validateNewMember, validateUpdateMember, validateEmail, validatePassword, validateNotification } = require("../../../models/Member");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
let validRequest;
let char;

describe("Joi validateNewMember()", () => {
  beforeEach(() => {
    validRequest = {
      name: "namestring",
      address1: "Address Line 1",
      address2: "Address Line 2",
      city: "city",
      state_prov: "aa",
      country: "aa",
      zip_postal: "12345",
      phone: "5555551212",
      email: "email@email.com",
      password: "password",
      shipping_same: false,
      shipping_name: "namestring",
      shipping_address1: "Address Line 1",
      shipping_address2: "Address Line 2",
      shipping_city: "city",
      shipping_state_prov: "aa",
      shipping_country: "aa",
      shipping_zip_postal: "12345",
      shipping_phone: "5555551212",
      shipping_email: "email@email.com"
    };

    char = "a";
  });

  afterEach(() => {
    validRequest = null;
    char = null;
  });

  describe("req.body.name", () => {
    it("should return an error if it is not a string", () => {
      validRequest.name = 1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is not at least 5 characters", () => {
      validRequest.name = char.repeat(4);
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/5/);
    });

    it("should return an error if it is not at over 50 characters", () => {
      validRequest.name = char.repeat(51);
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/50/);
    });

    it("should return an error if it is empty", () => {
      validRequest.name = "";
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.name;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.address1", () => {
    it("should return an error if it is not a string", () => {
      validRequest.address1 = 1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/address1/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is not at least 10 characters", () => {
      validRequest.address1 = char.repeat(9);
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/address1/);
      expect(error.message).toMatch(/10/);
    });

    it("should return an error if it is empty", () => {
      validRequest.address1 = "";
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/address1/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.address1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/address1/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.address2", () => {
    it("should return an error if it is provided but not a string", () => {
      validRequest.address2 = 1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/address2/);
      expect(error.message).toMatch(/string/);
    });

    it("should not return an error if it is empty", () => {
      validRequest.address2 = "";
      const { error } = validateNewMember(validRequest);
      expect(error).toBe(null);
    });

    it("should not return an error if it is not provided", () => {
      delete validRequest.address2;
      const { error } = validateNewMember(validRequest);
      expect(error).toBe(null);
    });
  });

  describe("req.body.city", () => {
    it("should return an error if it not a string", () => {
      validRequest.city = 1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/city/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.city = "";
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/city/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.city;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/city/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.state_prov", () => {
    it("should return an error if it not a string", () => {
      validRequest.state_prov = 1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/state_prov/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it less than 2 characters", () => {
      validRequest.state_prov = char.repeat(1);
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/state_prov/);
      expect(error.message).toMatch(/2/);
    });

    it("should return an error if it is empty", () => {
      validRequest.state_prov = "";
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/state_prov/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.state_prov;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/state_prov/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.country", () => {
    it("should return an error if it not a string", () => {
      validRequest.country = 1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/country/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.country = "";
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/country/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is less than 2 characters", () => {
      validRequest.country = char.repeat(1);
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/country/);
      expect(error.message).toMatch(/2/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.country;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/country/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.zip_postal", () => {
    it("should return an error if it not a string", () => {
      validRequest.zip_postal = 1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/zip_postal/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.zip_postal = "";
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/zip_postal/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.zip_postal;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/zip_postal/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.phone", () => {
    it("should return an error if it not a string", () => {
      validRequest.phone = 1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/phone/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it does not match regex: /^[0-9]{7,10}$/", () => {
      validRequest.phone = "a";
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/phone/);
      expect(error.message).toMatch(/pattern/);
    });

    it("should return an error if it is empty", () => {
      validRequest.phone = "";
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/phone/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.phone;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/phone/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.email", () => {
    it("should return an error if it not a string", () => {
      validRequest.email = 1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/email/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it empty", () => {
      validRequest.email = "";
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/email/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not a valid email", () => {
      validRequest.email = "email@";
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/email/);
      expect(error.message).toMatch(/valid email/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.email;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/email/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.password", () => {
    it("should return an error if it not a string", () => {
      validRequest.password = 1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/password/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is less than 8 characters", () => {
      validRequest.password = char.repeat(7);
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/password/);
      expect(error.message).toMatch(/8/);
    });

    it("should return an error if it empty", () => {
      validRequest.password = "";
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/password/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.password;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/password/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.shipping_same", () => {
    it("should return an error if it not provided", () => {
      delete validRequest.shipping_same;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/shipping_same/);
      expect(error.message).toMatch(/required/);
    });

    it("should return an error if it not a boolean", () => {
      validRequest.shipping_same = 1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/shipping_same/);
      expect(error.message).toMatch(/boolean/);
    });
  });

  describe("req.body.shipping_name", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_name = 1;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_name/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_name = "";
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_name/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and is less than 5 characters", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_name = char.repeat(4);
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_name/);
      expect(error.message).toMatch(/5/);
    });

    it("should return an error shipping_same is false and is more than 50 characters", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_name = char.repeat(51);
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_name/);
      expect(error.message).toMatch(/50/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_name;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_name/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_name;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_address1", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_address1 = 1;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_address1/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_address1 = "";
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_address1/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and is less than 10 characters", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_address1 = char.repeat(9);
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_address1/);
      expect(error.message).toMatch(/10/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_address1;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_address1/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_address1;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_address2", () => {
    it("should return an error shipping_same is false and is not a string if provided", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_address2 = 1;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_address2/);
      expect(error.message).toMatch(/string/);
    });

    it("should not return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_address2 = "";
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error).toBe(null);
    });

    it("should not return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_address2;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error).toBe(null);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_address2;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_city", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_city = 1;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_city/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_city = "";
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_city/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_city;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_city/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_city;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_state_prov", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_state_prov = 1;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_state_prov/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is less than 2 characters", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_state_prov = char.repeat(1);
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_state_prov/);
      expect(error.message).toMatch(/2/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_state_prov = "";
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_state_prov/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_state_prov;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_state_prov/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_state_prov;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_country", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_country = 1;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_country/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is less than 2 characters", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_country = char.repeat(1);
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_country/);
      expect(error.message).toMatch(/2/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_country = "";
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_country/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_country;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_country/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_country;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_zip_postal", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_zip_postal = 1;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_zip_postal/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_zip_postal = "";
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_zip_postal/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_zip_postal;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_zip_postal/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_zip_postal;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_phone", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_phone = 1;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_phone/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_phone = "";
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_phone/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and does not match regex: /^[0-9]{7,10}$/", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_phone = "a";
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_phone/);
      expect(error.message).toMatch(/pattern/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_phone;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_phone/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_phone;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_email", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_email = 1;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_email/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_email = "";
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_email/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and is not a valid email", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_email = "email@";
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_email/);
      expect(error.message).toMatch(/valid email/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_email;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_email/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_email;
      const { error } = validateNewMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  it("should not return an error if it validated", () => {
    const { error } = validateNewMember(validRequest);
    expect(error).toBe(null);
  });
});

describe("Joi validateUpdateMember()", () => {
  beforeEach(() => {
    validRequest = {
      name: "namestring",
      address1: "Address Line 1",
      address2: "Address Line 2",
      city: "city",
      state_prov: "aa",
      country: "aa",
      zip_postal: "12345",
      phone: "5555551212",
      shipping_same: false,
      shipping_name: "namestring",
      shipping_address1: "Address Line 1",
      shipping_address2: "Address Line 2",
      shipping_city: "city",
      shipping_state_prov: "aa",
      shipping_country: "aa",
      shipping_zip_postal: "12345",
      shipping_phone: "5555551212",
      shipping_email: "email@email.com"
    };
    char = "a";
  });

  afterEach(() => {
    validRequest = null;
    char = null;
  });

  describe("req.body.name", () => {
    it("should return an error if it is not a string", () => {
      validRequest.name = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is not at least 5 characters", () => {
      validRequest.name = char.repeat(4);
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/5/);
    });

    it("should return an error if it is not at over 50 characters", () => {
      validRequest.name = char.repeat(51);
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/50/);
    });

    it("should return an error if it is empty", () => {
      validRequest.name = "";
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.name;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.address1", () => {
    it("should return an error if it is not a string", () => {
      validRequest.address1 = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/address1/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is not at least 10 characters", () => {
      validRequest.address1 = char.repeat(9);
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/address1/);
      expect(error.message).toMatch(/10/);
    });

    it("should return an error if it is empty", () => {
      validRequest.address1 = "";
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/address1/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.address1;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/address1/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.address2", () => {
    it("should return an error if it is provided but not a string", () => {
      validRequest.address2 = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/address2/);
      expect(error.message).toMatch(/string/);
    });

    it("should not return an error if it is empty", () => {
      validRequest.address2 = "";
      const { error } = validateUpdateMember(validRequest);
      expect(error).toBe(null);
    });

    it("should not return an error if it is not provided", () => {
      delete validRequest.address2;
      const { error } = validateUpdateMember(validRequest);
      expect(error).toBe(null);
    });
  });

  describe("req.body.city", () => {
    it("should return an error if it not a string", () => {
      validRequest.city = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/city/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.city = "";
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/city/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.city;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/city/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.state_prov", () => {
    it("should return an error if it not a string", () => {
      validRequest.state_prov = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/state_prov/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it less than 2 characters", () => {
      validRequest.state_prov = char.repeat(1);
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/state_prov/);
      expect(error.message).toMatch(/2/);
    });

    it("should return an error if it is empty", () => {
      validRequest.state_prov = "";
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/state_prov/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.state_prov;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/state_prov/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.country", () => {
    it("should return an error if it not a string", () => {
      validRequest.country = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/country/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.country = "";
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/country/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is less than 2 characters", () => {
      validRequest.country = char.repeat(1);
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/country/);
      expect(error.message).toMatch(/2/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.country;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/country/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.zip_postal", () => {
    it("should return an error if it not a string", () => {
      validRequest.zip_postal = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/zip_postal/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.zip_postal = "";
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/zip_postal/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.zip_postal;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/zip_postal/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.phone", () => {
    it("should return an error if it not a string", () => {
      validRequest.phone = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/phone/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it does not match regex: /^[0-9]{7,10}$/", () => {
      validRequest.phone = "a";
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/phone/);
      expect(error.message).toMatch(/pattern/);
    });

    it("should return an error if it is empty", () => {
      validRequest.phone = "";
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/phone/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.phone;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/phone/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.shipping_same", () => {
    it("should return an error if it not provided", () => {
      delete validRequest.shipping_same;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/shipping_same/);
      expect(error.message).toMatch(/required/);
    });

    it("should return an error if it not a boolean", () => {
      validRequest.shipping_same = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(error.message).toMatch(/shipping_same/);
      expect(error.message).toMatch(/boolean/);
    });
  });

  describe("req.body.shipping_name", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_name = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_name/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_name = "";
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_name/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and is less than 5 characters", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_name = char.repeat(4);
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_name/);
      expect(error.message).toMatch(/5/);
    });

    it("should return an error shipping_same is false and is more than 50 characters", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_name = char.repeat(51);
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_name/);
      expect(error.message).toMatch(/50/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_name;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_name/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_name;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_address1", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_address1 = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_address1/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_address1 = "";
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_address1/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and is less than 10 characters", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_address1 = char.repeat(9);
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_address1/);
      expect(error.message).toMatch(/10/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_address1;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_address1/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_address1;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_address2", () => {
    it("should return an error shipping_same is false and is not a string if provided", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_address2 = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_address2/);
      expect(error.message).toMatch(/string/);
    });

    it("should not return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_address2 = "";
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error).toBe(null);
    });

    it("should not return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_address2;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error).toBe(null);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_address2;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_city", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_city = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_city/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_city = "";
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_city/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_city;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_city/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_city;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_state_prov", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_state_prov = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_state_prov/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is less than 2 characters", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_state_prov = char.repeat(1);
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_state_prov/);
      expect(error.message).toMatch(/2/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_state_prov = "";
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_state_prov/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_state_prov;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_state_prov/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_state_prov;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_country", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_country = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_country/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is less than 2 characters", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_country = char.repeat(1);
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_country/);
      expect(error.message).toMatch(/2/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_country = "";
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_country/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_country;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_country/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_country;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_zip_postal", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_zip_postal = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_zip_postal/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_zip_postal = "";
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_zip_postal/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_zip_postal;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_zip_postal/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_zip_postal;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_phone", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_phone = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_phone/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_phone = "";
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_phone/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and does not match regex: /^[0-9]{7,10}$/", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_phone = "a";
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_phone/);
      expect(error.message).toMatch(/pattern/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_phone;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_phone/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_phone;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.shipping_email", () => {
    it("should return an error shipping_same is false and is not a string", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_email = 1;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_email/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error shipping_same is false and is empty", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_email = "";
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_email/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error shipping_same is false and is not a valid email", () => {
      validRequest.shipping_same = false;
      validRequest.shipping_email = "email@";
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_email/);
      expect(error.message).toMatch(/valid email/);
    });

    it("should return an error shipping_same is false and it is not provided", () => {
      validRequest.shipping_same = false;
      delete validRequest.shipping_email;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(false);
      expect(error.message).toMatch(/shipping_email/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if shipping_same is true and it is not provided", () => {
      validRequest.shipping_same = true;
      delete validRequest.shipping_email;
      const { error } = validateUpdateMember(validRequest);
      expect(validRequest.shipping_same).toBe(true);
      expect(error).toBe(null);
    });
  });

  it("should not return an error if it validated", () => {
    const { error } = validateUpdateMember(validRequest);
    expect(error).toBe(null);
  });
});

describe("Joi validateEmail()", () => {
  beforeEach(() => {
    validRequest = { email: "email@email.com" };
    char = "a";
  });
  afterEach(() => {
    validRequest = null;
    char = null;
  });

  describe("req.body.email", () => {
    it("should return an error if it is not a string", () => {
      validRequest.email = 1;
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/email/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is not a valid email", () => {
      validRequest.email = "email@";
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/email/);
      expect(error.message).toMatch(/valid email/);
    });
    it("should return an error if it is not provided", () => {
      delete validRequest.email;
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/email/);
      expect(error.message).toMatch(/required/);
    });
    it("should not return an error if it is validated", () => {
      const { error } = validateEmail(validRequest);
      expect(error).toBe(null);
    });
  });
});

describe("Joi validatePassword()", () => {
  beforeEach(() => {
    validRequest = {
      oldpassword: "password",
      newpassword: "drowssap",
      confirmpassword: "drowssap"
    };
    char = "a";
  });

  afterEach(() => {
    validRequest = null;
    char = null;
  });

  describe("req.body.oldpassword", () => {
    it("should return an error if it is not a string", () => {
      validRequest.oldpassword = 1;
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/oldpassword/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is not at least 8 characters", () => {
      validRequest.oldpassword = char.repeat(7);
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/oldpassword/);
      expect(error.message).toMatch(/8/);
    });

    it("should return an error if it is empty", () => {
      validRequest.oldpassword = "";
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/oldpassword/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it not provided", () => {
      delete validRequest.oldpassword;
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/oldpassword/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.newpassword", () => {
    it("should return an error if it is the same as oldpassword", () => {
      validRequest.newpassword = validRequest.oldpassword;
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/newpassword/);
      expect(error.message).toMatch(/invalid/);
    });

    it("should return an error if it is not a string", () => {
      validRequest.newpassword = 1;
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/newpassword/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is not at least 8 characters", () => {
      validRequest.newpassword = char.repeat(7);
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/newpassword/);
      expect(error.message).toMatch(/8/);
    });

    it("should return an error if it is empty", () => {
      validRequest.newpassword = "";
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/newpassword/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it not provided", () => {
      delete validRequest.newpassword;
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/newpassword/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.confirmpassword", () => {
    it("should return an error if it is not a string", () => {
      validRequest.confirmpassword = 1;
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/confirmpassword/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.confirmpassword = "";
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/confirmpassword/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it does not match req.body.newpassword", () => {
      validRequest.confirmpassword = "notmatch";
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/confirmpassword/);
      expect(error.message).toMatch(/match/);
    });

    it("should return an error if it not provided", () => {
      delete validRequest.confirmpassword;
      const { error } = validatePassword(validRequest);
      expect(error.message).toMatch(/confirmpassword/);
      expect(error.message).toMatch(/required/);
    });

    it("should not return an error if it is validated", () => {
      const { error } = validatePassword(validRequest);
      expect(error).toBe(null);
    });
  });
});

describe("Joi validateNotification()", () => {
  beforeEach(() => {
    validRequest = {
      recipients: [new mongoose.Types.ObjectId().toHexString()],
      message: "message",
      clickTo: "clicktoURL"
    };
    char = "a";
  });

  afterEach(() => {
    validRequest = null;
    char = null;
  });

  describe("req.body.recipients", () => {
    it("should return an error if it is not an array", () => {
      validRequest.recipients = 1;
      const { error } = validateNotification(validRequest);
      expect(error.message).toMatch(/recipients/);
      expect(error.message).toMatch(/array/);
    });

    it("should return an error if array is empty", () => {
      validRequest.recipients = [];
      const { error } = validateNotification(validRequest);
      expect(error.message).toMatch(/recipients/);
      expect(error.message).toMatch(/required/);
    });

    it("should return an error if any element in the array is not a string", () => {
      validRequest.recipients = [1];
      const { error } = validateNotification(validRequest);
      expect(error.message).toMatch(/recipients/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if any element in the array is not a valid ObjectID", () => {
      validRequest.recipients = ["notavalidobjectid"];
      const { error } = validateNotification(validRequest);
      expect(error.message).toMatch(/recipients/);
      expect(error.message).toMatch(/pattern/);
    });

    it("should return an error if any array is not provided", () => {
      delete validRequest.recipients;
      const { error } = validateNotification(validRequest);
      expect(error.message).toMatch(/recipients/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.message", () => {
    it("should return an error if it is not a string", () => {
      validRequest.message = 1;
      const { error } = validateNotification(validRequest);
      expect(error.message).toMatch(/message/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.message = "";
      const { error } = validateNotification(validRequest);
      expect(error.message).toMatch(/message/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is empty", () => {
      delete validRequest.message;
      const { error } = validateNotification(validRequest);
      expect(error.message).toMatch(/message/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.clickTo", () => {
    it("should return an error if it provided and is not a string", () => {
      validRequest.clickTo = 1;
      const { error } = validateNotification(validRequest);
      expect(error.message).toMatch(/clickTo/);
      expect(error.message).toMatch(/string/);
    });

    it("should not return an error if it is empty", () => {
      validRequest.clickTo = "";
      const { error } = validateNotification(validRequest);
      expect(error).toBe(null);
    });

    it("should not return an error if it is not provided", () => {
      delete validRequest.clickTo;
      const { error } = validateNotification(validRequest);
      expect(error).toBe(null);
    });
  });

  it("should not return an error if it validated", () => {
    const { error } = validateNotification(validRequest);
    expect(error).toBe(null);
  });
});
