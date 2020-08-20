const _ = require('lodash');
const bcrypt = require('bcryptjs');
const Tzdb = require('timezonedb').Tzdb;
const randomString = require('randomstring');
const mailer = require('../utils/mailer');
const createError = require('http-errors');
const config = require('../config/config');

const tzdb = new Tzdb({
  apiToken: process.env.TIMEZONEDB_KEY,
});

const geocoder = require('../utils/geocoder');

const {
  Member,
  validateNewRegister,
  validateLogin,
  validateForgotEmail,
  validatePasswordReset,
} = require('../models/Member');

const { Team } = require('../models/Team');
const {
  signAccessToken,
  signRefreshToken,
} = require('../middleware/jwt-helpers');

module.exports = {
  // @desc    Member login
  // @route   POST /api/v1/auth/login
  // @access  Public
  login: async (req, res, next) => {
    try {
      const { error } = validateLogin(req.body);
      if (error) throw createError(400, error, error.details);

      // checks if user with email exists
      const member = await Member.findOne({ email: req.body.email });
      if (!member) throw createError(400, 'Invalid email or password.');

      // compares input password with db password
      const validPassword = await bcrypt.compare(
        req.body.password,
        member.password
      );
      if (!validPassword) throw createError(400, 'Invalid email or password.');

      // checks if account is closed
      if (member.closedAccount)
        throw createError(401, 'Account Deactivated - contact admin/manager');

      // checks if account has not been verified
      if (!member.isVerified)
        throw createError(403, 'Account unverified, click "Resend"');

      // generates an JSONWebToken once authenticated
      const token = await signAccessToken(member.id);
      const rtoken = await signRefreshToken(member.id);

      res.cookie('tb_access_token', token, {
        maxAge: config.ACCESS_TOKEN_TTL_NUMBER,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'production' ? false : true,
      });

      res.cookie('tb_refresh_token', rtoken, {
        maxAge: config.REFRESH_TOKEN_TTL_NUMBER,
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'production' ? false : true,
      });

      res.cookie(
        'tb_member',
        { aud: member._id },
        {
          maxAge: 1000 * 60 * 60 * 24 * 31,
          secure: process.env.NODE_ENV !== 'production' ? false : true,
        }
      );

      return res.send([
        {
          token,
          rtoken,
          member: _.pick(member, [
            '_id',
            'email',
            'name',
            'isAdmin',
            'timezone',
            'createdAt',
          ]),
          message: 'Logged In',
        },
      ]);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Member Register
  // @route   POST /api/v1/auth/register
  // @access  Public
  register: async (req, res, next) => {
    try {
      const { error } = validateNewRegister(req.body.member);
      if (error) throw createError(400, error, error.details);

      const team = await Team.findById(req.params.id);
      if (!team) throw createError(400, 'Team with the given ID not found');

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
        billingEmail,
      } = req.body.member;

      // checks if the word "password" or email address is in their password and denies creation
      const userEmail = email.split('@')[0];
      if (password.includes('password'))
        throw createError(400, 'Please do not use "password" in your password');
      if (password.includes(userEmail))
        throw createError(
          400,
          'Please do not use your email username in your password'
        );

      // checks if email already registered
      const member = await Member.findOne({ email });
      if (member) throw createError(400, 'Member already registered.');

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
        isAdmin: false,
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
        lng: loc[0].longitude,
      });

      newMember.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
      };

      newMember.timezone = data.zoneName;

      newMember.notifications.push({
        date: new Date(),
        message: 'Welcome to Team Builder!',
      });
      const notification = {
        date: Date.now(),
        message: `You are now part of team ${team.name}`,
        clickTo: `/dashboard/teams/${team._id}`,
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
              message: `${newMember.name} just joined your team - ${team.name}!`,
            },
          },
        }
      );

      await Member.updateOne(
        { _id: team.adminId },
        {
          $push: {
            notifications: {
              date: Date.now(),
              message: `${newMember.name} just joined team - ${team.name}!`,
            },
          },
        }
      );

      // generates a resetToken
      const token = randomString.generate();

      // saves reset token and expiry to member
      newMember.verificationToken = token;
      let date = new Date();
      date.setDate(date.getDate() + 7);
      newMember.verificationTokenExpires = date;

      await newMember.save();

      await mailer.sendEmail({
        to: newMember.email,
        subject: 'TeamBuilder Account Verification',
        text: `Hello and welcome to TeamBuilder.  Please click the link below to verify your account email within 7 days!

        ${req.headers.origin}/verify?token=${token}

        Thank you for joining us!
        `,
        html: `<b>Hello and welcome to TeamBuilder.  Please click the link below to verify your account email within 7 days!</b><br><br>
        <a href="${req.headers.origin}/verify?token=${token}">Verify my account</a><br><br>
        Thank you for joining us!
        `,
      });

      return res.send([{ message: 'You are now registered!' }]);
    } catch (err) {
      next(err);
    }
  },

  // @desc Member Forgot Password
  // @route POST /api/v1/auth/forgot
  // @access Public
  forgotPassword: async (req, res, next) => {
    try {
      const { error } = validateForgotEmail(req.body);
      if (error) throw createError(400, error, error.details);

      // checks if user with email exists
      const member = await Member.findOne({ email: req.body.email });
      if (!member) throw createError.BadRequest();

      // checks if account is closed
      if (member.closedAccount)
        throw createError(403, 'Account Deactived - contact admin/manager');

      // generates a resetToken
      const token = randomString.generate();

      // saves reset token and expiry to member
      member.resetPasswordToken = token;
      member.resetPasswordTokenExpires = Date.now() + 3600 * 1000;

      await member.save();

      await mailer.sendEmail({
        to: member.email,
        subject: 'TeamBuilder Password Reset',
        text: `Hello, we received a request to reset your password!
        You can go ahead and do so by clicking the link below:
        ${req.headers.origin}/reset?token=${token}

        If you did not request a password reset, you can ignore this email.
        `,
        html: `<b>Hello, we received a request to reset your password!</b><br><br>
        You can go ahead and do so by clicking the link below:<br>
        <a href="${req.headers.origin}/reset?token=${token}">Reset my password</a><br><br>
        
        If you did not request a password reset, you can ignore this email.
        `,
      });

      return res.send([
        {
          message: 'Reset Link Sent!',
        },
      ]);
    } catch (err) {
      next(err);
    }
  },

  // @desc Member Check Reset Password Token
  // @route GET /api/v1/auth/reset
  // @access Public
  checkResetPasswordToken: async (req, res, next) => {
    const token = req.query.token;
    if (!token) throw createError(400, 'Reset Password Token not provided');

    try {
      const member = await Member.findOne({ resetPasswordToken: token });
      if (!member) throw createError(400, 'Reset token invalid');

      if (member.resetPasswordTokenExpires < Date.now())
        throw createError(400, 'Reset token expired');

      return res.status(200).send({ member: _.pick(member, ['_id', 'email']) });
    } catch (err) {
      next(err);
    }
  },

  // @desc Member Reset Password
  // @route POST /api/v1/auth/reset/:id
  // @access Public
  resetPassword: async (req, res, next) => {
    const { error } = validatePasswordReset(req.body);
    if (error) throw createError(400, error, error.details);

    if (!req.params.id) throw createError(400, 'Member ID not provided');

    const id = req.params.id;
    const { password } = req.body;

    try {
      const member = await Member.findById(id);
      if (!member) throw createError(404, 'Member not found');

      if (!member.resetPasswordToken || member.resetPasswordToken === '')
        throw createError(
          403,
          'Password already reset with token - Please try again'
        );

      // checks if the word "password" or email address is in their password and denies creation
      const memberEmail = member.email.split('@')[0];
      if (password.includes('password'))
        throw createError(400, "Password contains 'password'");
      if (password.includes(memberEmail))
        throw createError(400, "Password contains 'email'");

      const salt = await bcrypt.genSalt(10);
      member.password = await bcrypt.hash(password, salt);
      member.resetPasswordToken = null;
      member.resetPasswordTokenExpires = null;
      member.isVerified = true;

      await member.save();

      await mailer.sendEmail({
        to: member.email,
        subject: 'TeamBuilder Password Reset',
        text: `Hello, your password was recently reset successfully.

        If you did not request a password reset, please contact your team manager or admin.
        `,
        html: `<b>Hello, your password was recently reset successfully</b><br><br>
        If you did not request a password reset, please contact your team manager or admin.
        `,
      });

      return res.status(200).send({ message: 'Password has been reset' });
    } catch (err) {
      next(err);
    }
  },

  // @desc Member Verify Email
  // @route POST /api/v1/auth/verifyemail
  // @access Public
  verifyEmail: async (req, res, next) => {
    try {
      const { error } = validateForgotEmail(req.body);
      if (error) throw createError(400, error, error.details);

      // checks if user with email exists
      const member = await Member.findOne({ email: req.body.email });
      if (!member) throw createError(400, 'Invalid email/password');

      // checks if account is closed
      if (member.closedAccount)
        throw createError(403, 'Account deactivated - contact admin/manager');
      if (member.isVerified) throw createError(400, 'Account already verified');

      // generates a resetToken
      const token = randomString.generate();

      // saves reset token and expiry to member
      member.verificationToken = token;
      member.verificationTokenExpires = Date.now() + 3600 * 1000;

      await member.save();

      await mailer.sendEmail({
        to: member.email,
        subject: 'TeamBuilder Account Verification',
        text: `Hello, we received a request to verify your account!
        You can go ahead and do so by clicking the link below:
        ${req.headers.origin}/verify?token=${token}

        If you did not make this request, you can ignore this email.
        `,
        html: `<b>Hello, we received a request to verify your account!</b><br><br>
        You can go ahead and do so by clicking the link below:<br>
        <a href="${req.headers.origin}/verify?token=${token}">Verify my account</a><br><br>
        
        If you did not make this request, you can ignore this email.
        `,
      });

      return res.send([
        {
          message: 'Verification Email Sent',
        },
      ]);
    } catch (err) {
      next(err);
    }
  },

  // @desc Member Verify Account
  // @route GET /api/v1/auth/verify
  // @access Public
  verifyAccount: async (req, res, next) => {
    const token = req.query.token;
    if (!token) throw createError(400, 'Verification Token not provided');

    try {
      const member = await Member.findOne({ verificationToken: token });
      if (!member) throw createError(400, 'Verification token invalid');

      if (member.verificationTokenExpires < Date.now())
        throw createError(400, 'Verification token expired');

      member.isVerified = true;
      member.verificationToken = undefined;
      member.verificationTokenExpires = undefined;

      await member.save();

      return res.status(200).send({ message: 'Account verified' });
    } catch (err) {
      next(err);
    }
  },
};
