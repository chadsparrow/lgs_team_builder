const { Member } = require('../../../models/Member');
const request = require('supertest');
const bcrypt = require('bcryptjs');
let app;
let reqBody;
const password = 'password1';

describe('/api/auth', () => {
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

    reqBody = {
      email: member.email,
      password: password
    };

    await member.save();
  });

  afterEach(async () => {
    await Member.deleteMany();
  });

  describe('POST /', () => {
    const exec = async () => {
      return await request(app)
        .post('/api/auth')
        .send(reqBody);
    };

    it('should return a 400 if req is invalidated by Joi', async () => {
      reqBody = {};
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return a 401 if email doesnt exist', async () => {
      reqBody = {
        email: 'wrongauth@auth.com',
        password: password
      };

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return a 401 if password is incorrect', async () => {
      reqBody = {
        email: 'auth@auth.com',
        password: 'notthepassword'
      };

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return a valid JWT Token', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
    });
  });
});
