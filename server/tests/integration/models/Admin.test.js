const { validateNewAdmin, validateAdminPassword } = require("../../../models/Admin");
let validRequest;

describe("Joi validateAdminPassword()", () => {
  beforeEach(() => {
    validRequest = { oldpassword: "password", newpassword: "drowssap", confirmpassword: "drowssap" };
  });

  afterEach(() => {
    validRequest = {};
  });

  describe("req.body.oldpassword", () => {
    it("should return an error if it is less than 8 characters", () => {
      validRequest.oldpassword = "passwor";
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/oldpassword/);
    });

    it("should return an error if it is empty", () => {
      validRequest.oldpassword = "";
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/oldpassword/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not a string", () => {
      validRequest.oldpassword = 1;
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/oldpassword/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is not provided at all", () => {
      delete validRequest.oldpassword;
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/oldpassword/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.newpassword", () => {
    it("should return an error if it is less than 8 characters", () => {
      validRequest.newpassword = "drowssa";
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/newpassword/);
    });

    it("should return an error if it is empty", () => {
      validRequest.newpassword = "";
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/newpassword/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not a string", () => {
      validRequest.newpassword = 1;
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/newpassword/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is not provided at all", () => {
      delete validRequest.newpassword;
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/newpassword/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.confirmpassword", () => {
    it("should return an error if it is less than 8 characters", () => {
      validRequest.confirmpassword = "drowssa";
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/confirmpassword/);
    });

    it("should return an error if it is empty", () => {
      validRequest.confirmpassword = "";
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/confirmpassword/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not a string", () => {
      validRequest.confirmpassword = 1;
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/confirmpassword/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is not provided at all", () => {
      delete validRequest.confirmpassword;
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/confirmpassword/);
      expect(error.message).toMatch(/required/);
    });

    it("should return an error if it does not match req.body.newpassword", () => {
      validRequest.confirmpassword = "drewssap";
      const { error } = validateAdminPassword(validRequest);
      expect(error.message).toMatch(/confirmpassword/);
      expect(error.message).toMatch(/match/);
    });
  });

  it("should return error as null if req.body is validated", () => {
    const { error } = validateAdminPassword(validRequest);
    expect(error).toBe(null);
  });
});

describe("Joi validateNewAdmin", () => {
  beforeEach(() => {
    validRequest = {
      name: "name",
      phone: "1234567",
      extension: "",
      office: "office name",
      email: "email@email.com",
      password: "password",
      confirm_password: "password",
      avatar_url: null
    };
  });
  afterEach(() => {
    validRequest = {};
  });

  describe("req.body.name", () => {
    it("should return an error if it is not a string", () => {
      validRequest.name = 1;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.name = "";
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return error if it is less than 4 characters", () => {
      validRequest.name = "nam";
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/4/);
    });

    it("should return error if it is more than 50 characters", () => {
      validRequest.name = "averylongstringthatwillcover50characterstomaketestfail";
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/50/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.name;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/name/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.phone", () => {
    it("should return an error if it is not a string", () => {
      validRequest.phone = 1;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/phone/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.phone = "";
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/phone/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it does not conform to regex /^[0-9]{7,10}$/", () => {
      validRequest.phone = "NOTFON";
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/phone/);
      expect(error.message).toMatch(/pattern/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.phone;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/phone/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.extension", () => {
    it("should return an error if it is provided and not a string", () => {
      validRequest.extension = 1;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/extension/);
      expect(error.message).toMatch(/string/);
    });

    it("should not return an error if it is provided but empty", () => {
      validRequest.extension = "";
      const { error } = validateNewAdmin(validRequest);
      expect(error).toBe(null);
    });

    it("should not return an error if it is provided but null", () => {
      validRequest.extension = null;
      const { error } = validateNewAdmin(validRequest);
      expect(error).toBe(null);
    });

    it("should not return an error if it is not provided", () => {
      delete validRequest.extension;
      const { error } = validateNewAdmin(validRequest);
      expect(error).toBe(null);
    });
  });

  describe("req.body.office", () => {
    it("should return an error if it is not a string", () => {
      validRequest.office = 1;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/office/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.office = "";
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/office/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.office;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/office/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.email", () => {
    it("should return an error if it is not a string", () => {
      validRequest.email = 1;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/email/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.email = "";
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/email/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not a valid email", () => {
      validRequest.email = "email@";
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/valid email/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.email;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/email/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.password", () => {
    it("should return an error if it is not a string", () => {
      validRequest.password = 1;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/password/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is not at least 8 characters", () => {
      validRequest.password = "passwor";
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/password/);
      expect(error.message).toMatch(/8/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.password;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/password/);
      expect(error.message).toMatch(/required/);
    });

    it("should return an error if it is empty", () => {
      validRequest.password = "";
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/password/);
      expect(error.message).toMatch(/empty/);
    });
  });

  describe("req.body.confirm_password", () => {
    it("should return an error if it is not a string", () => {
      validRequest.confirm_password = 1;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/confirm_password/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.confirm_password = "";
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/confirm_password/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it does not match req.body.password", () => {
      validRequest.confirm_password = "passwerd";
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/confirm_password/);
      expect(error.message).toMatch(/match/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.confirm_password;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/confirm_password/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.avatar_url", () => {
    it("should return an error if it is provided and not a string", () => {
      validRequest.avatar_url = 1;
      const { error } = validateNewAdmin(validRequest);
      expect(error.message).toMatch(/avatar_url/);
      expect(error.message).toMatch(/string/);
    });

    it("should not return an error if it is provided but empty", () => {
      validRequest.avatar_url = "";
      const { error } = validateNewAdmin(validRequest);
      expect(error).toBe(null);
    });

    it("should not return an error if it is provided but null", () => {
      validRequest.avatar_url = null;
      const { error } = validateNewAdmin(validRequest);
      expect(error).toBe(null);
    });

    it("should not return an error if it is not provided", () => {
      delete validRequest.avatar_url;
      const { error } = validateNewAdmin(validRequest);
      expect(error).toBe(null);
    });
  });

  it("should return error as null if req.body is validated", () => {
    const { error } = validateNewAdmin(validRequest);
    expect(error).toBe(null);
  });
});
