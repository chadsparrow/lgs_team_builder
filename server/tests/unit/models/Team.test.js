const { validateTeamName, validateAddMember, validateTeam } = require("../../../models/Team");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
let validRequest;
let char;

afterAll(() => {
  validRequest = null;
  char = null;
});

describe("Joi validateTeamName()", () => {
  beforeEach(() => {
    validRequest = { name: "Team Name" };
  });
  describe("req.body.name", () => {
    it("should return an error if it is not a string", () => {
      validRequest.name = 1;
      const { error } = validateTeamName(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.name = "";
      const { error } = validateTeamName(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.name;
      const { error } = validateTeamName(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/required/);
    });
  });

  it("should not return an error if it is validated", () => {
    const { error } = validateTeamName(validRequest);
    expect(error).toBe(null);
  });
});

describe("Joi validateAddMember()", () => {
  beforeEach(() => {
    validRequest = { id: new mongoose.Types.ObjectId().toHexString() };
  });

  describe("req.body.id", () => {
    it("should return an error if it is not a string", () => {
      validRequest.id = 1;
      const { error } = validateAddMember(validRequest);
      expect(error.message).toMatch(/id/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.id = "";
      const { error } = validateAddMember(validRequest);
      expect(error.message).toMatch(/id/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.id;
      const { error } = validateAddMember(validRequest);
      expect(error.message).toMatch(/id/);
      expect(error.message).toMatch(/required/);
    });

    it("should return an error if it is not a valid objectId", () => {
      validRequest.id = "aaaaaaaaaaa";
      const { error } = validateAddMember(validRequest);
      expect(error.message).toMatch(/id/);
      expect(error.message).toMatch(/pattern/);
    });
  });

  it("should not return an error if it is validated", () => {
    const { error } = validateAddMember(validRequest);
    expect(error).toBe(null);
  });
});

describe("Joi validateTeam()", () => {
  beforeEach(() => {
    char = "a";
    validRequest = {
      logo: "http://image.com/image",
      admin_id: new mongoose.Types.ObjectId().toHexString(),
      manager_id: new mongoose.Types.ObjectId().toHexString(),
      useManagerDetails: false,
      contact_name: char.repeat(5),
      contact_address1: char.repeat(10),
      contact_address2: char.repeat(10),
      contact_city: "city",
      contact_state_prov: char.repeat(2),
      contact_country: char.repeat(2),
      contact_zip_postal: "90210",
      contact_phone: "1234567",
      contact_email: "email@email.com",
      bulk_use_above_details: false,
      bulk_contact_name: char.repeat(5),
      bulk_contact_address1: char.repeat(10),
      bulk_contact_address2: char.repeat(10),
      bulk_contact_city: "city",
      bulk_contact_state_prov: char.repeat(2),
      bulk_contact_country: char.repeat(2),
      bulk_contact_zip_postal: "90210",
      bulk_contact_phone: "1234567",
      bulk_contact_email: "email@email.com"
    };
  });

  describe("req.body.logo", () => {
    it("should return an error if it is provided and not a string", () => {
      validRequest.logo = 1;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/logo/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is provided and not a valid URI", () => {
      validRequest.logo = "a";
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/logo/);
      expect(error.message).toMatch(/valid uri/);
    });

    it("should not return an error if it is empty", () => {
      validRequest.logo = "";
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });

    it("should not return an error if it is not provided", () => {
      delete validRequest.logo;
      const { error } = validateTeam(validRequest);
      expect(error).toBe(null);
    });
  });

  describe("req.body.admin_id", () => {
    it("should return an error if it not provided", () => {
      delete validRequest.admin_id;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/admin_id/);
      expect(error.message).toMatch(/required/);
    });

    it("should return an error if it is not a string", () => {
      validRequest.admin_id = 1;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/admin_id/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.admin_id = "";
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/admin_id/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not a valid ObjectId", () => {
      validRequest.admin_id = "aaaaaaaaa";
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/admin_id/);
      expect(error.message).toMatch(/pattern/);
    });
  });

  describe("req.body.manager_id", () => {
    it("should return an error if it not provided", () => {
      delete validRequest.manager_id;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/manager_id/);
      expect(error.message).toMatch(/required/);
    });

    it("should return an error if it is not a string", () => {
      validRequest.manager_id = 1;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/manager_id/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.manager_id = "";
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/manager_id/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not a valid ObjectId", () => {
      validRequest.manager_id = "aaaaaaaaa";
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/manager_id/);
      expect(error.message).toMatch(/pattern/);
    });
  });

  describe("req.body.useManagerDetails", () => {
    it("should return an error if it not a boolean", () => {
      validRequest.useManagerDetails = 1;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/useManagerDetails/);
      expect(error.message).toMatch(/boolean/);
    });

    it("should return an error if it not provided", () => {
      delete validRequest.useManagerDetails;
      const { error } = validateTeam(validRequest);
      expect(error.message).toMatch(/useManagerDetails/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.contact_name", () => {
    it("should return an error if useManagerDetails == false and is not provided", () => {
      validRequest.useManagerDetails = false;
      delete validRequest.contact_name;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_name/);
      expect(error.message).toMatch(/required/);
    });

    it("should return an error if useManagerDetails == false and is not a string", () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_name = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_name/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if useManagerDetails == false and is not at least 5 characters", () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_name = char.repeat(4);
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_name/);
      expect(error.message).toMatch(/5/);
    });

    it("should return an error if useManagerDetails == false and it is more than 50 characters", () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_name = char.repeat(51);
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_name/);
      expect(error.message).toMatch(/50/);
    });

    it("should return an error if useManagerDetails == true and it is not a string", () => {
      validRequest.useManagerDetails = true;
      validRequest.contact_name = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error.message).toMatch(/contact_name/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if useManagerDetails == true and it is empty", () => {
      validRequest.useManagerDetails = true;
      validRequest.contact_name = "";
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error.message).toMatch(/contact_name/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if useManagerDetails == true and it is not at least 5 characters", () => {
      validRequest.useManagerDetails = true;
      validRequest.contact_name = char.repeat(4);
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error.message).toMatch(/contact_name/);
      expect(error.message).toMatch(/5/);
    });

    it("should return an error if useManagerDetails == true and it is more than 50 characters", () => {
      validRequest.useManagerDetails = true;
      validRequest.contact_name = char.repeat(51);
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error.message).toMatch(/contact_name/);
      expect(error.message).toMatch(/50/);
    });

    it("should not return an error if useManagerDetails == true and it is not provided", () => {
      validRequest.useManagerDetails = true;
      delete validRequest.contact_name;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error).toBe(null);
    });
  });

  describe("req.body.contact_address1", () => {
    it("should return an error if useManagerDetails == false and is not provided", () => {
      validRequest.useManagerDetails = false;
      delete validRequest.contact_address1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_address1/);
      expect(error.message).toMatch(/required/);
    });

    it("should return an error if useManagerDetails == false and is not a string", () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_address1 = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_address1/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if useManagerDetails == false and is not at least 10 characters", () => {
      validRequest.useManagerDetails = false;
      validRequest.contact_address1 = char.repeat(9);
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(false);
      expect(error.message).toMatch(/contact_address1/);
      expect(error.message).toMatch(/10/);
    });

    it("should return an error if useManagerDetails == true and it is not a string", () => {
      validRequest.useManagerDetails = true;
      validRequest.contact_address1 = 1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error.message).toMatch(/contact_address1/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if useManagerDetails == true and it is empty", () => {
      validRequest.useManagerDetails = true;
      validRequest.contact_address1 = "";
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error.message).toMatch(/contact_address1/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if useManagerDetails == true and it is not at least 10 characters", () => {
      validRequest.useManagerDetails = true;
      validRequest.contact_address1 = char.repeat(9);
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error.message).toMatch(/contact_address1/);
      expect(error.message).toMatch(/10/);
    });

    it("should not return an error if useManagerDetails == true and it is not provided", () => {
      validRequest.useManagerDetails = true;
      delete validRequest.contact_address1;
      const { error } = validateTeam(validRequest);
      expect(validRequest.useManagerDetails).toBe(true);
      expect(error).toBe(null);
    });
  });
});
