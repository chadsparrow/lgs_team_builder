const { validateEmail, validateMessage } = require("../../../models/Email");
const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
Joi.objectId = require("joi-objectid")(Joi);
let validRequest;

describe("validateEmail", () => {
  beforeEach(() => {
    validRequest = { recipients: [new mongoose.Types.ObjectId().toHexString()], subject: "subject", message: "message" };
  });

  afterEach(() => {
    validRequest = {};
  });

  it("should return an error if req.body.recipients is not an array", () => {
    validRequest.recipients = 1;
    const { error } = validateEmail(validRequest);
    expect(error.message).toMatch(/recipients/);
    expect(error.message).toMatch(/array/);
  });

  it("should return an error if req.body.recipients is an empty array", () => {
    validRequest.recipients = [];
    const { error } = validateEmail(validRequest);
    expect(error.message).toMatch(/recipients/);
  });

  it("should return an error if req.body.recipients are not valid ObjectID string", () => {
    validRequest.recipients = ["aaaa"];
    const { error } = validateEmail(validRequest);
    expect(error.message).toMatch(/recipients/);
    expect(error.message).toMatch(/pattern/);
  });

  it("should return an error if req.body.recipients is not provided", () => {
    delete validRequest.recipients;
    const { error } = validateEmail(validRequest);
    expect(error.message).toMatch(/recipients/);
    expect(error.message).toMatch(/required/);
  });

  it("should return an error if req.body.subject is a string", () => {
    validRequest.subject = 1;
    const { error } = validateEmail(validRequest);
    expect(error.message).toMatch(/subject/);
    expect(error.message).toMatch(/string/);
  });

  it("should return an error if req.body.subject is empty", () => {
    validRequest.subject = "";
    const { error } = validateEmail(validRequest);
    expect(error.message).toMatch(/subject/);
    expect(error.message).toMatch(/empty/);
  });

  it("should return an error if req.body.subject is not provided", () => {
    delete validRequest.subject;
    const { error } = validateEmail(validRequest);
    expect(error.message).toMatch(/subject/);
    expect(error.message).toMatch(/required/);
  });

  it("should return an error if req.body.message is not a string", () => {
    validRequest.message = 1;
    const { error } = validateEmail(validRequest);
    expect(error.message).toMatch(/message/);
    expect(error.message).toMatch(/string/);
  });

  it("should return an error if req.body.message is empty", () => {
    validRequest.message = "";
    const { error } = validateEmail(validRequest);
    expect(error.message).toMatch(/message/);
    expect(error.message).toMatch(/empty/);
  });

  it("should return an error if req.body.message is not provided", () => {
    delete validRequest.message;
    const { error } = validateEmail(validRequest);
    expect(error.message).toMatch(/message/);
    expect(error.message).toMatch(/required/);
  });

  it("should return error as null if req.body.message is validated", () => {
    const { error } = validateEmail(validRequest);
    expect(error).toBe(null);
  });
});

describe("validateMessage", () => {
  beforeEach(() => {
    validRequest = { message: "message" };
  });

  afterEach(() => {
    validRequest = {};
  });

  it("should return an error if req.body.message is not a string", () => {
    validRequest.message = 1;
    const { error } = validateMessage(validRequest);
    expect(error.message).toMatch(/message/);
    expect(error.message).toMatch(/string/);
  });

  it("should return an error if req.body.message is empty", () => {
    validRequest.message = "";
    const { error } = validateMessage(validRequest);
    expect(error.message).toMatch(/message/);
    expect(error.message).toMatch(/empty/);
  });

  it("should return an error if req.body.message is not provided", () => {
    delete validRequest.message;
    const { error } = validateMessage(validRequest);
    expect(error.message).toMatch(/message/);
    expect(error.message).toMatch(/required/);
  });

  it("should return error as null if req.body.message is validated", () => {
    const { error } = validateMessage(validRequest);
    expect(error).toBe(null);
  });
});
