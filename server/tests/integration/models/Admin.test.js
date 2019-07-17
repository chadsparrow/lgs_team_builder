const { validateNewAdmin, validateAdminPassword } = require("../../../models/Admin");
let validRequest;

describe("validateAdminPassword", () => {
  beforeEach(() => {
    validRequest = { oldpassword: "12345678", newpassword: "87654321", confirmpassword: "87654321" };
  });

  afterEach(() => {
    validRequest = {};
  });

  it("should return an error if req.body.oldpassword is less than 8 characters", () => {
    validRequest.oldpassword = "1234567";
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/oldpassword/);
  });

  it("should return an error if req.body.oldpassword is empty", () => {
    validRequest.oldpassword = "";
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/oldpassword/);
    expect(error.message).toMatch(/empty/);
  });

  it("should return an error if req.body.oldpassword is not a string", () => {
    validRequest.oldpassword = 1;
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/oldpassword/);
    expect(error.message).toMatch(/string/);
  });

  it("should return an error if req.body.oldpassword is not provided at all", () => {
    delete validRequest.oldpassword;
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/oldpassword/);
    expect(error.message).toMatch(/required/);
  });

  it("should return an error if req.body.newpassword is less than 8 characters", () => {
    validRequest.newpassword = "1234567";
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/newpassword/);
  });

  it("should return an error if req.body.newpassword is empty", () => {
    validRequest.newpassword = "";
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/newpassword/);
    expect(error.message).toMatch(/empty/);
  });

  it("should return an error if req.body.newpassword is not a string", () => {
    validRequest.newpassword = 1;
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/newpassword/);
    expect(error.message).toMatch(/string/);
  });

  it("should return an error if req.body.newpassword is not provided at all", () => {
    delete validRequest.newpassword;
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/newpassword/);
    expect(error.message).toMatch(/required/);
  });

  it("should return an error if req.body.confirmpassword is less than 8 characters", () => {
    validRequest.confirmpassword = "1234567";
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/confirmpassword/);
  });

  it("should return an error if req.body.confirmpassword is empty", () => {
    validRequest.confirmpassword = "";
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/confirmpassword/);
    expect(error.message).toMatch(/empty/);
  });

  it("should return an error if req.body.confirmpassword is not a string", () => {
    validRequest.confirmpassword = 1;
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/confirmpassword/);
    expect(error.message).toMatch(/string/);
  });

  it("should return an error if req.body.confirmpassword is not provided at all", () => {
    delete validRequest.confirmpassword;
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/confirmpassword/);
    expect(error.message).toMatch(/required/);
  });

  it("should return an error if req.body.confirmpassword does not match req.body.newpassword", () => {
    validRequest.confirmpassword = "87654320";
    const { error } = validateAdminPassword(validRequest);
    expect(error.message).toMatch(/confirmpassword/);
    expect(error.message).toMatch(/match/);
  });

  it("should return error as null if req.body is validated", () => {
    const { error } = validateAdminPassword(validRequest);
    expect(error).toBe(null);
  });
});

describe("validateNewAdmin", () => {
  beforeEach(() => {
    validRequest = {
      name: "1234",
      phone: "1234567",
      extension: "",
      office: "office name",
      email: "email@email.com",
      password: "12345678",
      confirm_password: "12345678",
      avatar_url: null
    };
  });
  afterEach(() => {
    validRequest = {};
  });

  it("should return an error if req.body.name is not a string", () => {
    validRequest.name = 1;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/name/);
    expect(error.message).toMatch(/string/);
  });

  it("should return an error if req.body.name is empty", () => {
    validRequest.name = "";
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/name/);
    expect(error.message).toMatch(/empty/);
  });

  it("should return error if req.body.name is less than 4 characters", () => {
    validRequest.name = "123";
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/name/);
    expect(error.message).toMatch(/4/);
  });

  it("should return error if req.body.name is more than 50 characters", () => {
    validRequest.name = "123456789012345678901234567890123456789012345678901";
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/name/);
    expect(error.message).toMatch(/50/);
  });

  it("should return an error if req.body.name is not provided", () => {
    delete validRequest.name;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/name/);
    expect(error.message).toMatch(/required/);
  });

  it("should return an error if req.body.phone is not a string", () => {
    validRequest.phone = 1;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/phone/);
    expect(error.message).toMatch(/string/);
  });

  it("should return an error if req.body.phone is empty", () => {
    validRequest.phone = "";
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/phone/);
    expect(error.message).toMatch(/empty/);
  });

  it("should return an error if req.body.phone does not conform to regex /^[0-9]{7,10}$/", () => {
    validRequest.phone = "a";
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/phone/);
    expect(error.message).toMatch(/pattern/);
  });

  it("should return an error if req.body.phone is not provided", () => {
    delete validRequest.phone;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/phone/);
    expect(error.message).toMatch(/required/);
  });

  it("should return an error if req.body.extension is provided and not a string", () => {
    validRequest.extension = 1;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/extension/);
    expect(error.message).toMatch(/string/);
  });

  it("should not return an error if req.body.extension is provided but empty", () => {
    validRequest.extension = "";
    const { error } = validateNewAdmin(validRequest);
    expect(error).toBe(null);
  });

  it("should not return an error if req.body.extension is provided but null", () => {
    validRequest.extension = null;
    const { error } = validateNewAdmin(validRequest);
    expect(error).toBe(null);
  });

  it("should not return an error if req.body.extension is not provided", () => {
    delete validRequest.extension;
    const { error } = validateNewAdmin(validRequest);
    expect(error).toBe(null);
  });

  it("should return an error if req.body.office is not a string", () => {
    validRequest.office = 1;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/office/);
    expect(error.message).toMatch(/string/);
  });

  it("should return an error if req.body.office is empty", () => {
    validRequest.office = "";
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/office/);
    expect(error.message).toMatch(/empty/);
  });

  it("should return an error if req.body.office is not provided", () => {
    delete validRequest.office;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/office/);
    expect(error.message).toMatch(/required/);
  });

  it("should return an error if req.body.email is not a string", () => {
    validRequest.email = 1;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/email/);
    expect(error.message).toMatch(/string/);
  });
  it("should return an error if req.body.email is empty", () => {
    validRequest.email = "";
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/email/);
    expect(error.message).toMatch(/empty/);
  });

  it("should return an error if req.body.email is not a valid email", () => {
    validRequest.email = "email@";
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/valid email/);
  });

  it("should return an error if req.body.email is not provided", () => {
    delete validRequest.email;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/email/);
    expect(error.message).toMatch(/required/);
  });

  it("should return an error if req.body.password is not a string", () => {
    validRequest.password = 1;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/password/);
    expect(error.message).toMatch(/string/);
  });

  it("should return an error if req.body.password is not at least 8 characters", () => {
    validRequest.password = "1234567";
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/password/);
    expect(error.message).toMatch(/8/);
  });

  it("should return an error if req.body.password is not provided", () => {
    delete validRequest.password;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/password/);
    expect(error.message).toMatch(/required/);
  });

  it("should return an error if req.body.password is empty", () => {
    validRequest.password = "";
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/password/);
    expect(error.message).toMatch(/empty/);
  });

  it("should return an error if req.body.confirm_password is not a string", () => {
    validRequest.confirm_password = 1;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/confirm_password/);
    expect(error.message).toMatch(/string/);
  });

  it("should return an error if req.body.confirm_password is empty", () => {
    validRequest.confirm_password = "";
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/confirm_password/);
    expect(error.message).toMatch(/empty/);
  });

  it("should return an error if req.body.confirm_password does not match req.body.password", () => {
    validRequest.confirm_password = "12345679";
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/confirm_password/);
    expect(error.message).toMatch(/match/);
  });

  it("should return an error if req.body.confirm_password is not provided", () => {
    delete validRequest.confirm_password;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/confirm_password/);
    expect(error.message).toMatch(/required/);
  });

  it("should return an error if req.body.avatar_url is provided and not a string", () => {
    validRequest.avatar_url = 1;
    const { error } = validateNewAdmin(validRequest);
    expect(error.message).toMatch(/avatar_url/);
    expect(error.message).toMatch(/string/);
  });

  it("should not return an error if req.body.avatar_url is provided but empty", () => {
    validRequest.avatar_url = "";
    const { error } = validateNewAdmin(validRequest);
    expect(error).toBe(null);
  });

  it("should not return an error if req.body.avatar_url is provided but null", () => {
    validRequest.avatar_url = null;
    const { error } = validateNewAdmin(validRequest);
    expect(error).toBe(null);
  });

  it("should not return an error if req.body.avatar_url is not provided", () => {
    delete validRequest.avatar_url;
    const { error } = validateNewAdmin(validRequest);
    expect(error).toBe(null);
  });

  it("should return error as null if req.body is validated", () => {
    const { error } = validateNewAdmin(validRequest);
    expect(error).toBe(null);
  });
});
