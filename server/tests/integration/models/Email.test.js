const { validateEmail, validateMessage } = require("../../../models/Email");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
let validRequest;

describe("Joi validateEmail()", () => {
  beforeEach(() => {
    validRequest = { recipients: [new mongoose.Types.ObjectId().toHexString()], subject: "subject", message: "message" };
  });

  afterEach(() => {
    validRequest = {};
  });

  describe("req.body.recipients", () => {
    it("should return an error if recipients is not an array", () => {
      validRequest.recipients = 1;
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/recipients/);
      expect(error.message).toMatch(/array/);
    });

    it("should return an error if recipients array is empty", () => {
      validRequest.recipients = [];
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/recipients/);
      expect(error.message).toMatch(/required/);
    });

    it("should return an error if any recipient is not a string", () => {
      validRequest.recipients = [1];
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/recipients/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if any recipient is not a valid ObjectID", () => {
      validRequest.recipients = ["notavalidobjectid"];
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/recipients/);
      expect(error.message).toMatch(/pattern/);
    });

    it("should return an error if any recipients is not provided", () => {
      delete validRequest.recipients;
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/recipients/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.subject", () => {
    it("should return an error if it is not a string", () => {
      validRequest.subject = 1;
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/subject/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.subject = "";
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/subject/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.subject;
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/subject/);
      expect(error.message).toMatch(/required/);
    });
  });

  describe("req.body.message", () => {
    it("should return an error if it is not a string", () => {
      validRequest.message = 1;
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/message/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.message = "";
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/message/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.message;
      const { error } = validateEmail(validRequest);
      expect(error.message).toMatch(/message/);
      expect(error.message).toMatch(/required/);
    });
  });

  it("should return error as null if it is validated", () => {
    const { error } = validateEmail(validRequest);
    expect(error).toBe(null);
  });
});

describe("Joi validateMessage()", () => {
  beforeEach(() => {
    validRequest = { message: "message" };
  });

  afterEach(() => {
    validRequest = {};
  });

  describe("req.body.message", () => {
    it("should return an error if it is not a string", () => {
      validRequest.message = 1;
      const { error } = validateMessage(validRequest);
      expect(error.message).toMatch(/message/);
      expect(error.message).toMatch(/string/);
    });

    it("should return an error if it is empty", () => {
      validRequest.message = "";
      const { error } = validateMessage(validRequest);
      expect(error.message).toMatch(/message/);
      expect(error.message).toMatch(/empty/);
    });

    it("should return an error if it is not provided", () => {
      delete validRequest.message;
      const { error } = validateMessage(validRequest);
      expect(error.message).toMatch(/message/);
      expect(error.message).toMatch(/required/);
    });
  });

  it("should return error as null if it is validated", () => {
    const { error } = validateMessage(validRequest);
    expect(error).toBe(null);
  });
});
