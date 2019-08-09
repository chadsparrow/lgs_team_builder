const admin = require('../../../middleware/admin');
const mongoose = require('mongoose');
let res = {};
const memberData = { id: mongoose.Types.ObjectId().toHexString, isAdmin: false };

describe('admin middleware', () => {
  const mockResponse = () => {
    res.status = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockRequest = memberData => {
    return {
      member: memberData
    };
  };

  it('should return an error if the member is not an admin', () => {
    const req = mockRequest(memberData);
    const res = mockResponse();
    const next = jest.fn();
    admin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith({ msg: 'Access Denied.' });
  });
});
