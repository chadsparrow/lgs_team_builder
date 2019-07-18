const { Member } = require("../../../models/Member");
const jwt = require("jsonwebtoken");
const config = require("config");
const mongoose = require("mongoose");

describe("member.generateAuthToken", () => {
  it("should return a valid JWT", () => {
    const payload = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true };
    const member = new Member(payload);
    const token = member.generateAuthToken();
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    expect(decoded).toMatchObject(payload);
  });
});
