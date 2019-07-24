const { Member } = require('../../../models/Member');
const request = require('supertest');
const bcrypt = require('bcryptjs');
let app;
let reqBody;

describe('/api/auth', () => {
  beforeEach(() => {
    app = require('../../../app');
    reqBody = {
      email: 'auth@auth.com',
      password: 'password1'
    };
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
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password1', salt);
      const member = new Member({
        name: 'user1',
        email: 'authwrong@auth.com',
        password: hash,
        phone: '5555551212',
        zip_postal: '12345',
        country: 'AB',
        state_prov: 'AB',
        city: 'City',
        address1: '123 Any Street'
      });

      await member.save();

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return a 401 if password is incorrect', async () => {
      const password = 'password1';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const member = new Member({
        name: 'user1',
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

      reqBody = {
        email: member.email,
        password: 'notthepassword'
      };

      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return a valid JWT Token', async () => {
      const password = 'password1';
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);
      const member = new Member({
        name: 'user1',
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

      reqBody = {
        email: member.email,
        password: password
      };

      const res = await exec();
      expect(res.status).toBe(200);
    });
  });
});
