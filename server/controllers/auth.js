const logger = require('../middleware/logger');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Joi = require('@hapi/joi');
const Tzdb = require('timezonedb').Tzdb;

const tzdb = new Tzdb({
  apiToken: process.env.TIMEZONEDB_KEY
});

const geocoder = require('../utils/geocoder');
const { Member, validateNewRegister } = require('../models/Member');
const { Team } = require('../models/Team');

const joiOptions = { abortEarly: false, language: { key: '{{key}} ' } };

function validateLogin(req) {
  const schema = {
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .min(8)
      .required()
      .trim(false)
  };
  return Joi.validate(req, schema, joiOptions);
}

module.exports = {
  // @desc    Member login
  // @route   POST /api/v1/auth/login
  // @access  Public
  memberLogin: async (req, res, next) => {
    try {
      const { error } = validateLogin(req.body);
      if (error) return res.status(400).send(error.details);

      // checks if user with email exists
      const member = await Member.findOne({ email: req.body.email });
      if (!member)
        return res
          .status(400)
          .send([{ message: 'Invalid email or password.' }]);

      // compares input password with db password
      const validPassword = await bcrypt.compare(
        req.body.password,
        member.password
      );
      if (!validPassword)
        return res.status(400).send([{ message: 'Invalid email or password' }]);

      // checks if account is closed
      if (member.closedAccount)
        return res.status(401).send([
          {
            message:
              'Your account is currently deactivated, contact your Admin/Manager to reactivate'
          }
        ]);

      // generates an JSONWebToken once authenticated
      const token = member.generateAuthToken();

      return res.send([
        {
          token,
          member: _.pick(member, [
            '_id',
            'email',
            'name',
            'isAdmin',
            'timezone',
            'createdAt'
          ]),
          message: 'Welcome Back!'
        }
      ]);
    } catch (err) {
      logger.error(err);
    }
  },

  // @desc    Member Register
  // @route   POST /api/v1/auth/register
  // @access  Public
  memberRegister: async (req, res, next) => {
    try {
      const { error } = validateNewRegister(req.body.member);
      if (error) return res.status(400).send(error.details);

      const team = await Team.findById(req.params.id);
      if (!team)
        return res
          .status(400)
          .send([{ message: 'Team with the given ID not found' }]);

      const {
        email,
        password,
        name,
        company,
        address1,
        address2,
        city,
        stateProv,
        country,
        zipPostal,
        phone,
        shippingSame,
        shippingName,
        shippingCompany,
        shippingAddress1,
        shippingAddress2,
        shippingCity,
        shippingStateProv,
        shippingCountry,
        shippingZipPostal,
        shippingPhone,
        shippingEmail,
        billingSame,
        billingName,
        billingCompany,
        billingAddress1,
        billingAddress2,
        billingCity,
        billingStateProv,
        billingCountry,
        billingZipPostal,
        billingPhone,
        billingEmail
      } = req.body.member;

      // checks if the word "password" or email address is in their password and denies creation
      const userEmail = email.split('@')[0];
      if (password.includes('password'))
        return res
          .status(400)
          .send([{ message: "Please do not use 'password' in your password" }]);
      if (password.includes(userEmail))
        return res
          .status(400)
          .send([
            {
              message: 'Please do not use your email username in your password'
            }
          ]);

      // checks if email already registered
      const member = await Member.findOne({ email });
      if (member)
        return res
          .status(400)
          .send([{ message: 'Member already registered.' }]);

      const newMember = new Member({
        name,
        company,
        address1,
        address2,
        city,
        stateProv,
        country,
        zipPostal,
        phone,
        email,
        isAdmin: false
      });

      if (shippingSame) {
        newMember.shipping.name = name;
        newMember.shipping.company = company;
        newMember.shipping.address1 = address1;
        newMember.shipping.address2 = address2;
        newMember.shipping.city = city;
        newMember.shipping.stateProv = stateProv;
        newMember.shipping.country = country;
        newMember.shipping.zipPostal = zipPostal;
        newMember.shipping.phone = phone;
        newMember.shipping.email = email;
      } else {
        newMember.shipping.name = shippingName;
        newMember.shipping.company = shippingCompany;
        newMember.shipping.address1 = shippingAddress1;
        newMember.shipping.address2 = shippingAddress2;
        newMember.shipping.city = shippingCity;
        newMember.shipping.stateProv = shippingStateProv;
        newMember.shipping.country = shippingCountry;
        newMember.shipping.zipPostal = shippingZipPostal;
        newMember.shipping.phone = shippingPhone;
        newMember.shipping.email = shippingEmail;
      }

      if (billingSame) {
        newMember.billing.name = name;
        newMember.billing.company = company;
        newMember.billing.address1 = address1;
        newMember.billing.address2 = address2;
        newMember.billing.city = city;
        newMember.billing.stateProv = stateProv;
        newMember.billing.country = country;
        newMember.billing.zipPostal = zipPostal;
        newMember.billing.phone = phone;
        newMember.billing.email = email;
      } else {
        newMember.billing.name = billingName;
        newMember.billing.company = billingCompany;
        newMember.billing.address1 = billingAddress1;
        newMember.billing.address2 = billingAddress2;
        newMember.billing.city = billingCity;
        newMember.billing.stateProv = billingStateProv;
        newMember.billing.country = billingCountry;
        newMember.billing.zipPostal = billingZipPostal;
        newMember.billing.phone = billingPhone;
        newMember.billing.email = billingEmail;
      }

      const salt = await bcrypt.genSalt(10);
      newMember.password = await bcrypt.hash(password, salt);

      const geoCodeAddress = `${newMember.shipping.address1} ${newMember.shipping.address2} ${newMember.shipping.city} ${newMember.shipping.stateProv} ${newMember.shipping.country} ${newMember.shipping.zipPostal}`;
      const loc = await geocoder.geocode(geoCodeAddress);

      const data = await tzdb.getTimeZoneByPosition({
        lat: loc[0].latitude,
        lng: loc[0].longitude
      });

      newMember.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude]
      };

      newMember.timezone = data.zoneName;

      newMember.notifications.push({
        date: new Date(),
        message: 'Welcome to Team Builder!'
      });
      const notification = {
        date: Date.now(),
        message: `You are now part of team ${team.name}`,
        clickTo: `/dashboard/teams/${team._id}`
      };
      newMember.notifications.push(notification);
      team.members.push(newMember._id);
      await team.save();

      await newMember.save();

      await Member.updateOne(
        { _id: team.managerId },
        {
          $push: {
            notifications: {
              date: Date.now(),
              message: `${newMember.name} just joined your team - ${team.name}!`
            }
          }
        }
      );

      await Member.updateOne(
        { _id: team.adminId },
        {
          $push: {
            notifications: {
              date: Date.now(),
              message: `${newMember.name} just joined team - ${team.name}!`
            }
          }
        }
      );

      return res.send([{ message: 'You are now registered!' }]);
    } catch (err) {
      logger.error(err);
    }
  }
};
