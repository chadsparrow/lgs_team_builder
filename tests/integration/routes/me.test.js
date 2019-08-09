const { Member } = require('../../../models/Member');
const bcrypt = require('bcryptjs');
const request = require('supertest');
let app;
let token;
let id;
let reqBody;
let member;

describe('/api/me/', () => {
  beforeEach(async () => {
    app = require('../../../app');

    const password = 'password1';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    member = {
      name: 'member1',
      email: 'member@member.com',
      password: hash,
      phone: '5555551212',
      zip_postal: '12345',
      country: 'AB',
      state_prov: 'AB',
      city: 'City',
      address1: '123 Any Street',
      shipping_same: true
    };
    const newMember = new Member(member);
    id = newMember._id;

    await newMember.save();
    token = newMember.generateAuthToken();
  });

  afterEach(async () => {
    await Member.collection.drop();
  });

  const exec = async () => {
    return await request(app)
      .get('/api/me')
      .set('x-auth-token', token);
  };

  describe('GET /', () => {
    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return the member and email info from current member', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.member).toHaveProperty('name', member.name.toUpperCase());
    });
  });
});
