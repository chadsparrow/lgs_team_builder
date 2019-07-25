const { Email } = require('../../../models/Email');
const { Member } = require('../../../models/Member');
const request = require('supertest');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
let token;
let app;
let password;
let member;
let email;
let id;
let newEmail;

describe('/api/emails', () => {
  beforeEach(async () => {
    app = require('../../../app');

    password = 'password1';
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

    email = {
      sender: mongoose.Types.ObjectId(id),
      subject: 'subject1',
      messages: [{ message: 'message1', date: Date.now(), sentBy: mongoose.Types.ObjectId(id) }],
      recipients: [{ member: mongoose.Types.ObjectId(id) }]
    };

    newEmail = new Email(email);
    await newEmail.save();
  });

  afterEach(async () => {
    await Member.collection.drop();
    await Email.collection.drop();
  });

  describe('GET /me', () => {
    const exec = async () => {
      return await request(app)
        .get('/api/emails/me')
        .set('x-auth-token', token);
    };

    it('should return 401 if client is not logged in', async () => {
      token = '';
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it('should return a 404 if there are no emails found', async () => {
      await Email.collection.drop();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it('should return all emails for current member', async () => {
      await newEmail.delete();
      const res = await exec();
      expect(res.status).toBe(200);
    });
  });
});
