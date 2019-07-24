const { Member } = require('../../../models/Member');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const mongoose = require('mongoose');
let app;
let token;
let id;
let reqBody;

describe('/api/members', () => {
  beforeEach(() => {
    app = require('../../../app');
  });

  afterEach(async () => {
    await Member.deleteMany({});
  });

  describe('GET /', () => {
    const exec = async () => {
      return await request(app)
        .get('/api/members')
        .set('x-auth-token', token);
    };

    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);
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
      token = member.generateAuthToken();
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return a 404 if there are no members', async () => {
      await Member.deleteMany({});
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ msg: 'There are no members in the database.' });
    });

    it('should return a list of members', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.some(g => g.email === 'email@email.com')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    it('should return 400 if invalid ID is passed', async () => {
      const res = await request(app).get('/api/members/1');

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Invalid ID.' });
    });

    it('should return 401 if client is not logged in', async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await request(app).get(`/api/members/${id}`);
      expect(res.status).toBe(401);
    });

    it('should return 400 if member with passed ID is not found', async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const salt = await bcrypt.genSalt(10);
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
        address1: '123 Any Street',
        isAdmin: false
      });

      await member.save();
      token = member.generateAuthToken();

      await Member.findByIdAndDelete(member._id);
      const res = await request(app)
        .get(`/api/members/${id}`)
        .set('x-auth-token', token);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Member with the given ID was not found.' });
    });

    it('should get the member the id is valid', async () => {
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

  describe('GET /register', () => {
    it('should return 400 if req.body is invalidated by Joi', async () => {
      const member = {};

      const res = await request(app)
        .post('/api/members/register')
        .send(member);

      expect(res.status).toBe(400);
    });

    it('should return 400 if req.body is validated by Joi but already in the database', async () => {
      const member = {
        name: 'user1',
        address1: '123 Any Street',
        city: 'City',
        state_prov: 'AB',
        country: 'AB',
        zip_postal: '12345',
        phone: '5555551212',
        email: 'email@email.com',
        password: 'password',
        shipping_same: true
      };

      const saveMember = new Member(member);
      await saveMember.save();

      const res = await request(app)
        .post('/api/members/register')
        .send(member);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Member already registered.' });
    });

    it('should return 200 and a new member object if the request is valid and member does not exist', async () => {
      const member = {
        name: 'user1',
        address1: '123 Any Street',
        city: 'City',
        state_prov: 'AB',
        country: 'AB',
        zip_postal: '12345',
        phone: '5555551212',
        email: 'email@email.com',
        password: 'password',
        shipping_same: true
      };

      const res = await request(app)
        .post('/api/members/register')
        .send(member);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', member.email);
      expect(res.body).toHaveProperty('name', member.name.toUpperCase());
    });
  });

  describe('PUT /:id', () => {
    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password1', salt);
      let member = new Member({
        name: 'user1',
        email: 'email@email.com',
        password: hash,
        phone: '5555551212',
        zip_postal: '12345',
        country: 'AB',
        state_prov: 'AB',
        city: 'City',
        address1: '123 Any Street',
        isAdmin: false
      });

      id = member._id;

      await member.save();
      token = member.generateAuthToken();
    });

    const exec = async (id, reqBody, token) => {
      return await request(app)
        .put(`/api/members/${id}`)
        .send(reqBody)
        .set('x-auth-token', token);
    };

    it('should return 400 if invalid ID is passed', async () => {
      id = '1';
      reqBody = {};
      token = '';
      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Invalid ID.' });
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      reqBody = '';
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await exec(id, reqBody, token);
      expect(res.status).toBe(401);
    });

    it('should return 400 if req.body is invalidated by Joi', async () => {
      await Member.deleteMany({});

      reqBody = {};

      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(400);
    });

    it('should return 403 if logged in member is not an admin and trying set a member as admin ', async () => {
      await Member.deleteMany({});

      reqBody = {
        name: 'user1',
        address1: '123 Any Street',
        city: 'City',
        state_prov: 'AB',
        country: 'AB',
        zip_postal: '12345',
        phone: '5555551212',
        shipping_same: true,
        isAdmin: true
      };

      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ msg: 'Access Denied.' });
    });

    it('should return 400 if requested member to change cannot be found', async () => {
      await Member.deleteMany({});

      reqBody = {
        name: 'user1',
        address1: '123 Any Street',
        city: 'City',
        state_prov: 'AB',
        country: 'AB',
        zip_postal: '12345',
        phone: '5555551212',
        shipping_same: true,
        isAdmin: false
      };

      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Member with the given ID was not found.' });
    });

    it('should return a member if valid and found', async () => {
      const reqBody = {
        name: 'user1',
        address1: '123 Any Street',
        city: 'City',
        state_prov: 'AB',
        country: 'AB',
        zip_postal: '12345',
        phone: '5555551212',
        shipping_same: true,
        isAdmin: false
      };

      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', reqBody.name.toUpperCase());
    });
  });

  describe('PATCH /email/:id', () => {
    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password1', salt);
      let member = new Member({
        name: 'user1',
        email: 'email@email.com',
        password: hash,
        phone: '5555551212',
        zip_postal: '12345',
        country: 'AB',
        state_prov: 'AB',
        city: 'City',
        address1: '123 Any Street',
        isAdmin: false
      });

      id = member._id;

      await member.save();
      token = member.generateAuthToken();
    });

    const exec = async (id, reqBody, token) => {
      return await request(app)
        .patch(`/api/members/email/${id}`)
        .send(reqBody)
        .set('x-auth-token', token);
    };

    it('should return 400 if invalid ID is passed', async () => {
      id = '1';
      reqBody = {};
      token = '';
      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Invalid ID.' });
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      reqBody = '';
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await exec(id, reqBody, token);
      expect(res.status).toBe(401);
    });

    it('should return 400 if req.body is invalidated by Joi', async () => {
      await Member.deleteMany({});

      reqBody = {};

      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(400);
    });

    it('should return 400 if requested member to change cannot be found', async () => {
      await Member.deleteMany({});

      reqBody = {
        email: 'email@email.com'
      };

      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Member with the given ID was not found.' });
    });

    it('should return 400 if email passed is same as stored value', async () => {
      reqBody = {
        email: 'email@email.com'
      };

      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Email is identical to what is already set.' });
    });

    it('should return 400 if valid email passed is already registered', async () => {
      const newMember = new Member({
        name: 'user2',
        email: 'email1@email.com',
        address1: '123 Any Street',
        password: 'password',
        city: 'City',
        state_prov: 'AB',
        country: 'AB',
        zip_postal: '12345',
        phone: '5555551212',
        shipping_same: true,
        isAdmin: false
      });
      await newMember.save();

      reqBody = {
        email: 'email1@email.com'
      };
      const res = await exec(id, reqBody, token);
      expect(res.status).toBe(400);
    });

    it('should return a member if valid and found', async () => {
      const reqBody = {
        email: 'email1@email.com'
      };

      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', reqBody.email);
    });
  });

  describe('PATCH /password/:id', () => {
    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password1', salt);
      let member = new Member({
        name: 'user1',
        email: 'email@email.com',
        password: hash,
        phone: '5555551212',
        zip_postal: '12345',
        country: 'AB',
        state_prov: 'AB',
        city: 'City',
        address1: '123 Any Street',
        isAdmin: false
      });

      id = member._id;

      await member.save();
      token = member.generateAuthToken();
    });

    const exec = async (id, reqBody, token) => {
      return await request(app)
        .patch(`/api/members/password/${id}`)
        .send(reqBody)
        .set('x-auth-token', token);
    };

    it('should return 400 if invalid ID is passed', async () => {
      id = '1';
      reqBody = {};
      token = '';
      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Invalid ID.' });
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      reqBody = '';
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await exec(id, reqBody, token);
      expect(res.status).toBe(401);
    });

    it('should return 400 if req.body is invalidated by Joi', async () => {
      await Member.deleteMany({});

      reqBody = {};

      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(400);
    });

    it('should return 400 if requested member to change cannot be found', async () => {
      await Member.deleteMany({});

      reqBody = {
        oldpassword: 'password1',
        newpassword: 'newpassword',
        confirmpassword: 'newpassword'
      };

      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Member with the given ID was not found.' });
    });

    it('should return 400 if req.body.oldpassword is incorrect', async () => {
      reqBody = {
        oldpassword: 'nottherightpassword',
        newpassword: 'newpassword',
        confirmpassword: 'newpassword'
      };

      const res = await exec(id, reqBody, token);
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Password incorrect.' });
    });

    it('should return a member if valid and found', async () => {
      const reqBody = {
        oldpassword: 'password1',
        newpassword: 'newpassword',
        confirmpassword: 'newpassword'
      };

      const res = await exec(id, reqBody, token);

      expect(res.status).toBe(200);
    });
  });

  describe('DELETE /:id', () => {
    beforeEach(async () => {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password1', salt);
      let member = new Member({
        name: 'user1',
        email: 'email@email.com',
        password: hash,
        phone: '5555551212',
        zip_postal: '12345',
        country: 'AB',
        state_prov: 'AB',
        city: 'City',
        address1: '123 Any Street',
        isAdmin: false
      });

      id = member._id;

      await member.save();
      token = member.generateAuthToken();
    });

    const exec = async (id, token) => {
      return await request(app)
        .delete(`/api/members/${id}`)
        .set('x-auth-token', token);
    };

    it('should return 400 if invalid ID is passed', async () => {
      id = '1';
      token = '';
      const res = await exec(id, token);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Invalid ID.' });
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await exec(id, token);
      expect(res.status).toBe(401);
    });

    it('should return 403 if client is not an admin', async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await exec(id, token);
      expect(res.status).toBe(403);
    });

    it('should return 400 if requested member to change cannot be found', async () => {
      await Member.deleteMany({});

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password1', salt);
      let member = new Member({
        name: 'user1',
        email: 'email@email.com',
        password: hash,
        phone: '5555551212',
        zip_postal: '12345',
        country: 'AB',
        state_prov: 'AB',
        city: 'City',
        address1: '123 Any Street',
        isAdmin: true
      });

      id = member._id;

      await member.save();
      token = member.generateAuthToken();
      await Member.deleteMany({});

      const res = await exec(id, token);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Member with the given ID was not found.' });
    });

    it('should delete a member if valid and found', async () => {
      await Member.deleteMany({});
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash('password1', salt);
      let member = new Member({
        name: 'user1',
        email: 'email@email.com',
        password: hash,
        phone: '5555551212',
        zip_postal: '12345',
        country: 'AB',
        state_prov: 'AB',
        city: 'City',
        address1: '123 Any Street',
        isAdmin: true
      });

      id = member._id;

      await member.save();
      token = member.generateAuthToken();

      const res = await exec(id, token);

      expect(res.status).toBe(200);
    });
  });
});
