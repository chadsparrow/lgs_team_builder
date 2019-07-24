const request = require('supertest');
const { Member } = require('../../../models/Member');
const bcrypt = require('bcryptjs');

let token;

describe('auth middleware', () => {
  beforeEach(async () => {
    app = require('../../../app');

    await Member.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('password1', salt);
    const member = new Member({
      name: 'auth1',
      email: 'auth@auth.com',
      password: hash,
      phone: '5555551212',
      zip_postal: '12345',
      country: 'AB',
      state_prov: 'AB',
      city: 'City',
      address1: '123 Any Street'
    });

    await member.save();
    token = member.generateAuthToken();
  });

  afterEach(async () => {
    await Member.deleteMany();
  });

  const exec = () => {
    return request(app)
      .get('/api/members')
      .set('x-auth-token', token);
  };

  it('should return 401 if no token is provided', async () => {
    token = '';
    const res = await exec();
    expect(res.status).toBe(401);
  });

  it('should return 400 if token is invalid', async () => {
    token = 'a';
    const res = await exec();
    expect(res.status).toBe(400);
  });

  it('should return 200 if token is valid', async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
