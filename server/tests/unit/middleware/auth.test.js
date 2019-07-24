const { Member } = require('../../../models/Member');
const auth = require('../../../middleware/auth');
const mongoose = require('mongoose');

describe('auth middleware', () => {
  it('should populate req.member with the payload of a valid JWT', () => {
    const member = { _id: mongoose.Types.ObjectId().toHexString(), isAdmin: true };
    const token = new Member(member).generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const res = {};
    const next = jest.fn();
    auth(req, res, next);

    expect(req.member).toMatchObject(member);
  });
});
