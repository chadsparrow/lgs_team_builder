const { Member } = require('../../../models/Member');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const mongoose = require('mongoose');
let app;

describe('/api/members', () => {
  beforeEach(() => {
    app = require('../../../app');
  });

  afterEach(async () => {
    await Member.deleteMany({});
  });

  describe('GET /', () => {
    it('should return 401 if client is not logged in', async () => {
      const res = await request(app).get('/api/members');
      expect(res.status).toBe(401);
    });

    it('should return a 404 if there are no members', async () => {
      let salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password1', salt);
      const member = new Member({
        name: 'user1',
        email: 'email@email.com',
        password: hash,
        phone: '5555551212',
        zip_postal: '12345',
        country: 'AB',
        state_prov: 'AB',
        city: 'City',
        address1: '123 Any Street'
      });

      await member.save();
      const token = member.generateAuthToken();

      await Member.findByIdAndDelete(member._id);

      const res = await request(app)
        .get('/api/members')
        .set('x-auth-token', token);
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ msg: 'There are no members in the database.' });
    });

    it('should return a list of members', async () => {
      let salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password1', salt);
      const member = new Member({
        name: 'user1',
        email: 'email@email.com',
        password: hash,
        phone: '5555551212',
        zip_postal: '12345',
        country: 'AB',
        state_prov: 'AB',
        city: 'City',
        address1: '123 Any Street'
      });

      await member.save();
      const token = member.generateAuthToken();

      const res = await request(app)
        .get('/api/members')
        .set('x-auth-token', token);
      expect(res.status).toBe(200);
      expect(res.body.some(g => g.email === member.email)).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return 401 if client is not logged in', async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await request(app).get(`/api/members/${id}`);
      expect(res.status).toBe(401);
    });

    it('should return 400 if invalid ID is passed', async () => {
      const res = await request(app).get('/api/members/1');

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Invalid ID.' });
    });

    it('should return 404 if member with passed ID is not found', async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      let salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password1', salt);
      const member = new Member({
        name: 'user1',
        email: 'email@email.com',
        password: hash,
        phone: '5555551212',
        zip_postal: '12345',
        country: 'AB',
        state_prov: 'AB',
        city: 'City',
        address1: '123 Any Street'
      });

      await member.save();
      const token = member.generateAuthToken();

      await Member.findByIdAndDelete(member._id);
      const res = await request(app)
        .get(`/api/members/${id}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ msg: 'Member with the given ID was not found.' });
    });

    it('should return a member', async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      let salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password1', salt);
      const member = new Member({
        name: 'user1',
        email: 'email@email.com',
        password: hash,
        phone: '5555551212',
        zip_postal: '12345',
        country: 'AB',
        state_prov: 'AB',
        city: 'City',
        address1: '123 Any Street'
      });

      await member.save();
      const token = member.generateAuthToken();

      const res = await request(app)
        .get(`/api/members/${member._id}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', member.email);
      expect(res.body).toHaveProperty('email', member.email);
    });
  });
});
