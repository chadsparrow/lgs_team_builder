const { Member } = require('../../../models/Member');
const request = require('supertest');
const bcrypt = require('bcryptjs');
let app;
let email;
let password;

describe('/api/auth', () => {
  beforeAll(async () => {
    app = require('../../../app');

    password = 'password1';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    member = {
      name: 'auth1',
      email: 'auth@auth.com',
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

    await newMember.save();

    token = newMember.generateAuthToken();
  });

  afterAll(async () => {
    await Member.collection.drop();
  });

  describe('POST /', () => {
    const exec = async () => {
      return await request(app)
        .post('/api/auth')
        .send({ email, password });
    };

    it('should return a 400 if req is invalidated by Joi', async () => {
      email = '';
      password = '';
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return a 401 if email doesnt exist', async () => {
      email = 'wrong@auth.com';
      password = 'password1';

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return a 401 if password is incorrect', async () => {
      email = 'auth@auth.com';
      password = 'notthepassword';

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return a valid JWT Token', async () => {
      email = 'auth@auth.com';
      password = 'password1';

      const res = await exec();
      expect(res.status).toBe(200);
    });
  });
});
