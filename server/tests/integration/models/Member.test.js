const { validateNewMember, validateUpdateMember, validateEmail, validatePassword, validateNotification } = require("../../../models/Member");
let validRequest;

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
  });

  afterEach(() => {
    validRequest = {};
  });

  describe("req.body.name", () => {
    it("should return an error if it is not a string", () => {
      validRequest.name = 1;
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is not at least 5 characters", () => {
      validRequest.name = "name";
      const { error } = validateNewMember(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/5/);
    });

    it("should return an error if it is not at over 50 characters", () => {
      validRequest.name = "verylongstringthatisatleast50characterstomaketestfail";
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
      validRequest.address1 = "tenchars";
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
});
