const { Member } = require('../../../models/Member');
const bcrypt = require('bcryptjs');
const request = require('supertest');
const mongoose = require('mongoose');
let app;
let token;
let id;
let reqBody;
let member;

describe('/api/members', () => {
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

  describe('GET /', () => {
    const exec = async () => {
      return await request(app)
        .get('/api/members')
        .set('x-auth-token', token);
    };

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return a 404 if there are no members', async () => {
      await Member.collection.drop();
      const res = await exec();
      expect(res.status).toBe(404);
      expect(res.body).toMatchObject({ msg: 'There are no members in the database.' });
    });

    it('should return a list of members', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body.some(g => g.email === 'member@member.com')).toBeTruthy();
    });
  });

  describe('GET /:id', () => {
    const exec = async () => {
      return await request(app)
        .get(`/api/members/${id}`)
        .set('x-auth-token', token);
    };

    it('should return 400 if invalid ID is passed', async () => {
      id = '1';
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Invalid ID.' });
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if member with passed ID is not found', async () => {
      id = mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Member with the given ID was not found.' });
    });

    it('should get the member if the id is valid', async () => {
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', member.email);
      expect(res.body).toHaveProperty('email', member.email);
    });
  });

  describe('GET /register', () => {
    const exec = async () => {
      return await request(app)
        .post('/api/members/register')
        .send(reqBody);
    };

    it('should return 400 if req.body is invalidated by Joi', async () => {
      reqBody = {};
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if email is already registered', async () => {
      reqBody = member;
      delete reqBody._id;

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Member already registered.' });
    });

    it('should return 200 and a new member object if the request is valid and member does not exist', async () => {
      reqBody = {
        name: 'member2',
        address1: '123 Any Street',
        city: 'City',
        state_prov: 'AB',
        country: 'AB',
        zip_postal: '12345',
        phone: '5555551212',
        email: 'newmember@member.com',
        password: 'password1',
        shipping_same: true
      };

      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', reqBody.email);
      expect(res.body).toHaveProperty('name', reqBody.name.toUpperCase());
    });
  });

  describe('PUT /:id', () => {
    const exec = async () => {
      return await request(app)
        .put(`/api/members/${id}`)
        .send(reqBody)
        .set('x-auth-token', token);
    };

    it('should return 400 if invalid ID is passed', async () => {
      id = '1';
      reqBody = {};
      token = '';
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Invalid ID.' });
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      reqBody = '';
      id = mongoose.Types.ObjectId().toHexString();
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if req.body is invalidated by Joi', async () => {
      reqBody = {};

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 403 if logged in member is not an admin and trying set a member as admin ', async () => {
      reqBody = {
        name: 'member1',
        address1: '123 Any Street',
        city: 'City',
        state_prov: 'AB',
        country: 'AB',
        zip_postal: '12345',
        phone: '5555551212',
        shipping_same: true,
        isAdmin: true
      };

      const res = await exec();

      expect(res.status).toBe(403);
      expect(res.body).toMatchObject({ msg: 'Access Denied.' });
    });

    it('should return 400 if requested member cannot be found', async () => {
      await Member.collection.drop();

      reqBody = {
        name: 'member1',
        address1: '123 Any Street',
        city: 'City',
        state_prov: 'AB',
        country: 'AB',
        zip_postal: '12345',
        phone: '5555551212',
        shipping_same: true,
        isAdmin: false
      };

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Member with the given ID was not found.' });
    });

    it('should return a member if valid and found', async () => {
      reqBody = {
        name: 'member1',
        address1: '123 Any Street',
        city: 'City',
        state_prov: 'AB',
        country: 'AB',
        zip_postal: '12345',
        phone: '5555551212',
        shipping_same: true,
        isAdmin: false
      };

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('name', reqBody.name.toUpperCase());
    });
  });

  describe('PATCH /email/:id', () => {
    const exec = async () => {
      return await request(app)
        .patch(`/api/members/email/${id}`)
        .send(reqBody)
        .set('x-auth-token', token);
    };

    it('should return 400 if invalid ID is passed', async () => {
      id = '1';
      reqBody = {};
      token = '';
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Invalid ID.' });
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      reqBody = {};
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if req.body is invalidated by Joi', async () => {
      reqBody = {};
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return 400 if member is not found', async () => {
      await Member.collection.drop();

      reqBody = {
        email: 'member@member.com'
      };

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Member with the given ID was not found.' });
    });

    it('should return 400 if email passed is same as stored value', async () => {
      reqBody = {
        email: 'member@member.com'
      };

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Email is identical to what is already set.' });
    });

    it('should return 400 if valid email passed is already registered', async () => {
      const newMember = new Member({
        name: 'member2',
        email: 'member2@member.com',
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
        email: 'member2@member.com'
      };
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it('should return a member if valid and not already registered', async () => {
      const reqBody = {
        email: 'member2@member.com'
      };

      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('email', reqBody.email);
    });
  });

  describe('PATCH /password/:id', () => {
    const exec = async () => {
      return await request(app)
        .patch(`/api/members/password/${id}`)
        .send(reqBody)
        .set('x-auth-token', token);
    };

    it('should return 400 if invalid ID is passed', async () => {
      id = '1';
      reqBody = {};
      token = '';
      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Invalid ID.' });
    });

    it('should return 401 if client is not logged in', async () => {
      token = '';
      reqBody = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return 400 if req.body is invalidated by Joi', async () => {
      reqBody = {};

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it('should return 400 if member cannot be found', async () => {
      await Member.collection.drop();

      reqBody = {
        oldpassword: 'password1',
        newpassword: 'newpassword',
        confirmpassword: 'newpassword'
      };

      const res = await exec();

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Member with the given ID was not found.' });
    });

    it('should return 400 if req.body.oldpassword is incorrect', async () => {
      reqBody = {
        oldpassword: 'nottherightpassword',
        newpassword: 'newpassword',
        confirmpassword: 'newpassword'
      };

      const res = await exec();
      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Password incorrect.' });
    });

    it('should return a member if valid and password updated', async () => {
      reqBody = {
        oldpassword: 'password1',
        newpassword: 'newpassword',
        confirmpassword: 'newpassword'
      };

      const res = await exec();

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

    afterEach(async () => {
      await Member.collection.drop();
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
      await Member.collection.drop();

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
      await Member.collection.drop();

      const res = await exec(id, token);

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({ msg: 'Member with the given ID was not found.' });
    });

    it('should delete a member if valid and found', async () => {
      await Member.collection.drop();
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
