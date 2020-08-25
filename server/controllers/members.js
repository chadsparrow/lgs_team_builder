const generator = require('generate-password');
const randomstring = require('randomstring');
const bcrypt = require('bcryptjs');
const clone = require('lodash/clone');

const Tzdb = require('timezonedb').Tzdb;
const tzdb = new Tzdb({
  apiToken: process.env.TIMEZONEDB_KEY,
});

const mailer = require('../utils/mailer');
const geocoder = require('../utils/geocoder');
const createError = require('http-errors');

const { Team } = require('../models/Team');
const {
  Member,
  validateNewMember,
  validateUpdateMember,
  validateEmail,
  validatePassword,
} = require('../models/Member');

module.exports = {
  // @desc    Get all members - Admin only
  // @route   GET /api/v1/members/
  // @access  Private - admin
  getMembers: async (req, res, next) => {
    try {
      const members = await Member.find({
        _id: { $ne: req.member._id },
        closedAccount: false,
      })
        .select('_id name email isAdmin invites isVerified')
        .sort({ name: 1 });

      if (members && members.length === 0)
        throw createError(404, 'There are no members in the database');

      return res.send(members);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Get all admin members - only display id, name and email
  // @route   GET /api/v1/members/admins
  // @access  Private
  getAdmins: async (req, res, next) => {
    try {
      const admins = await Member.find({ isAdmin: true, closedAccount: false })
        .sort({ name: 1 })
        .select('_id name email isVerified');
      return res.status(200).send(admins);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Gets specific member - only specific fields
  // @route   GET /api/v1/members/:id
  // @access  Private
  getMember: async (req, res, next) => {
    try {
      const member = await Member.findById(req.params.id).select(
        '_id name email createdAt timezone isAdmin'
      );
      if (!member)
        throw createError(400, 'Member with the given ID was not found');

      return res.send(member);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Gets more detailed info about certain member
  // @route   GET /api/v1/members/:id/details
  // @access  Private
  getMemberDetails: async (req, res, next) => {
    try {
      const member = await Member.findById(req.params.id).select(
        '-__v -updatedAt -password -notifications'
      );

      const teams = await Team.find({ members: req.params.id }).select(
        'name _id'
      );

      if (!member)
        throw createError(400, 'Member with the given ID was not found');

      return res.send({ member, teams });
    } catch (err) {
      next(err);
    }
  },

  // @desc    Gets detailed info on current member logged in.
  // @route   GET /api/v1/members/:id/me
  // @access  Private
  getMyDetails: async (req, res, next) => {
    try {
      const me = await Member.findById(req.params.id).select(
        '-__v -updatedAt -password'
      );
      return res.status(200).send(me);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Add a new member - creates password automatically - reset token must be used to reset it
  // @route   GET /api/v1/members/register
  // @access  Private - admin
  adminRegisterMember: async (req, res, next) => {
    try {
      const { error } = validateNewMember(req.body);
      if (error) throw createError(400, error, error.details);

      const { contact } = req.body;

      const member = await Member.findOne({ email: contact.email });
      if (member) throw createError(400, 'Email already registered');

      let password;
      if (process.env.NODE_ENV === 'development') {
        password = 'password';
      } else {
        password = generator.generate({ length: 10, numbers: true });
      }

      const newMember = new Member({
        name: contact.name,
        password,
        company: contact.company,
        address1: contact.address1,
        address2: contact.address2,
        city: contact.city,
        stateProv: contact.stateProv,
        country: contact.country,
        zipPostal: contact.zipPostal,
        phone: contact.phone,
        email: contact.email,
        isAdmin: false,
      });

      newMember.notifications.push({
        date: new Date(),
        message: 'Welcome to Team Builder!',
      });

      newMember.billing = clone(req.body.billing);
      newMember.shipping = clone(req.body.shipping);

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

      // generates a resetToken
      const token = randomstring.generate();

      // saves reset token and expiry to member
      newMember.resetPasswordToken = token;
      newMember.resetPasswordTokenExpires = Date.now() + 3600 * 1000;

      await newMember.save();

      // SEND EMAIL TO USER TO ALLOW PASSWORD RESET USING TOKEN
      await mailer.sendEmail({
        to: newMember.email,
        subject: 'TeamBuilder Password Reset',
        text: `Hello, You've been added as a member on TeamBuilder and we just need you to verify your account and setup your password!
        You can go ahead and do so by clicking the link below:

        ${req.headers.origin}/reset?token=${token}

        Thanks.
        `,
        html: `<b>You've been added as a member on TeamBuilder and we just need you to verify your account and setup your password!</b><br><br>
        You can go ahead and do so by clicking the link below:<br><br>
        <a href="${req.headers.origin}/reset?token=${token}">Reset my password</a><br><br>
        
        Thanks!.
        `,
      });

      return res.status(201).send([{ message: 'Member Registered' }]);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Update a member
  // @route   PUT /api/v1/members/:id
  // @access  Private
  updateMember: async (req, res, next) => {
    try {
      const { error } = validateUpdateMember(req.body);
      if (error) throw createError(400, error, error.details);

      const {
        name,
        company,
        phone,
        address1,
        address2,
        city,
        stateProv,
        country,
        zipPostal,
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
      } = req.body;

      const updateMember = await Member.findById(req.params.id);
      if (!updateMember)
        throw createError(400, 'Member with the given ID was not found');

      updateMember.name = name;
      updateMember.company = company;
      updateMember.address1 = address1;
      updateMember.address2 = address2;
      updateMember.city = city;
      updateMember.stateProv = stateProv;
      updateMember.country = country;
      updateMember.zipPostal = zipPostal;
      updateMember.phone = phone;

      if (shippingSame) {
        updateMember.shipping.name = updateMember.name;
        updateMember.shipping.company = updateMember.company;
        updateMember.shipping.address1 = updateMember.address1;
        updateMember.shipping.address2 = updateMember.address2;
        updateMember.shipping.city = updateMember.city;
        updateMember.shipping.stateProv = updateMember.stateProv;
        updateMember.shipping.country = updateMember.country;
        updateMember.shipping.zipPostal = updateMember.zipPostal;
        updateMember.shipping.phone = updateMember.phone; // DOUBLE CHECK THIS WORKS
        updateMember.shipping.email = updateMember.email;
      } else {
        updateMember.shipping.name = shippingName;
        updateMember.shipping.company = shippingCompany;
        updateMember.shipping.address1 = shippingAddress1;
        updateMember.shipping.address2 = shippingAddress2;
        updateMember.shipping.city = shippingCity;
        updateMember.shipping.stateProv = shippingStateProv;
        updateMember.shipping.country = shippingCountry;
        updateMember.shipping.zipPostal = shippingZipPostal;
        updateMember.shipping.phone = shippingPhone;
        updateMember.shipping.email = shippingEmail;
      }

      if (billingSame) {
        updateMember.billing.name = updateMember.name;
        updateMember.billing.company = updateMember.company;
        updateMember.billing.address1 = updateMember.address1;
        updateMember.billing.address2 = updateMember.address2;
        updateMember.billing.city = updateMember.city;
        updateMember.billing.stateProv = updateMember.stateProv;
        updateMember.billing.country = updateMember.country;
        updateMember.billing.zipPostal = updateMember.zipPostal;
        updateMember.billing.phone = updateMember.phone;
        updateMember.billing.email = updateMember.email;
      } else {
        updateMember.billing.name = billingName;
        updateMember.billing.company = billingCompany;
        updateMember.billing.address1 = billingAddress1;
        updateMember.billing.address2 = billingAddress2;
        updateMember.billing.city = billingCity;
        updateMember.billing.stateProv = billingStateProv;
        updateMember.billing.country = billingCountry;
        updateMember.billing.zipPostal = billingZipPostal;
        updateMember.billing.phone = billingPhone;
        updateMember.billing.email = billingEmail;
      }

      const geoCodeAddress = `${updateMember.shipping.address1} ${updateMember.shipping.address2} ${updateMember.shipping.city} ${updateMember.shipping.stateProv} ${updateMember.shipping.country} ${updateMember.shipping.zipPostal}`;
      const loc = await geocoder.geocode(geoCodeAddress);

      const data = await tzdb.getTimeZoneByPosition({
        lat: loc[0].latitude,
        lng: loc[0].longitude,
      });

      updateMember.location = {
        type: 'Point',
        coordinates: [loc[0].longitude, loc[0].latitude],
      };

      updateMember.timezone = data.zoneName;

      await updateMember.save();

      const updateMemberMainContact = {
        name: updateMember.name,
        company: updateMember.company,
        address1: updateMember.address1,
        address2: updateMember.address2,
        city: updateMember.city,
        stateProv: updateMember.stateProv,
        country: updateMember.country,
        zipPostal: updateMember.zipPostal,
        phone: updateMember.phone,
        email: updateMember.email,
      };

      // also updates information for team there email is used in main contact or bulk shipping information
      const teamsToUpdate = await Team.find({
        $or: [
          { 'mainContact.email': updateMember.email },
          { 'bulkShipping.email': updateMember.email },
        ],
      });

      if (teamsToUpdate && teamsToUpdate.length > 0) {
        teamsToUpdate.forEach(async (team) => {
          if (team.mainContact.email === updateMember.email) {
            await Team.updateOne(
              { _id: team._id },
              { $set: { mainContact: updateMemberMainContact } }
            );
          }

          if (team.bulkShipping.email === updateMember.email) {
            await Team.updateOne(
              { _id: team._id },
              {
                $set: {
                  bulkShipping: updateMember.shipping,
                  timezone: updateMember.timezone,
                },
              }
            );
          }
        });
      }

      return res.status(200).send([{ message: 'Member Updated' }]);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Update the email of a user
  // @route   PATCH /api/v1/members/email/:id
  // @access  Private
  updateEmailAddress: async (req, res, next) => {
    try {
      const { error } = validateEmail(req.body);
      if (error) throw createError(400, error, error.details);

      const { currentEmail, newEmail } = req.body;

      const member = await Member.findById(req.params.id);
      if (!member)
        throw createError(400, 'Member with the given ID was not found');

      if (member.email === newEmail) {
        return res.status(400).send([
          {
            message: 'Email is identical to what is already set.',
            context: { key: 'newEmail' },
          },
        ]);
      }

      // checks if new email already exists in the database and denies
      const emailCheck = await Member.findOne({
        _id: { $ne: req.params.id },
        email: newEmail,
      });

      if (emailCheck) {
        return res.status(400).send([
          {
            message: 'New email address already taken',
            context: { key: 'newEmail' },
          },
        ]);
      }

      member.email = newEmail;

      if (member.billing.email === currentEmail) {
        member.billing.email = newEmail;
      }

      if (member.shipping.email === currentEmail) {
        member.shipping.email = newEmail;
      }

      await member.save();

      // also updates any team where the old email should be replaced with the new email in mainContact or bulkShipping info
      await Team.updateMany(
        { 'mainContact.email': currentEmail },
        { 'mainContact.email': newEmail }
      );
      await Team.updateMany(
        { 'bulkShipping.email': currentEmail },
        { 'bulkShipping.email': newEmail }
      );

      return res
        .status(200)
        .send([
          { message: 'Email address updated - this will be your new login.' },
        ]);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Update a members password
  // @route   PATCH /api/v1/members/password/:id
  // @access  Private
  updatePassword: async (req, res, next) => {
    try {
      const { error } = validatePassword(req.body);
      if (error) throw createError(400, error, error.details);

      const { oldPassword, newPassword } = req.body;

      const member = await Member.findById(req.params.id);
      if (!member)
        throw createError(400, 'Member with the given ID was not found');

      // checks to make sure the current password is correct
      const result = await bcrypt.compare(oldPassword, member.password);
      if (!result) throw createError(403, 'Password incorrect');

      const userEmail = member.email.split('@')[0];

      // doesnt allow member to use 'password' in their password or the email address in their password
      if (newPassword.includes('password'))
        throw createError(400, "Password contains 'password'");

      if (newPassword.includes(userEmail))
        throw createError(400, 'Password contains your email address');

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);

      member.password = hash;
      await member.save();

      return res.status(200).send([{ message: 'Member password updated' }]);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Deactivates a member (no deletion)
  // @route   DELETE /api/v1/members/:id
  // @access  Private - admin
  deactivateMember: async (req, res, next) => {
    try {
      // if member is a manager of a team, will not allow - need to pick a new manager in team window first
      const teams = await Team.find({ 'managerId._id': req.params.id });
      if (teams && teams.length > 0)
        throw createError(
          400,
          'Contact your Team Admin to select a new Team Manager first'
        );

      const member = await Member.updateOne(
        { _id: req.params.id },
        { closedAccount: true }
      );
      if (!member)
        throw createError(400, 'Member with the given ID was not found');

      // removes member from all teams that member was a part of
      await Team.updateMany(
        { members: req.params.id },
        { $pull: { members: req.params.id } }
      );

      return res.status(200).send([{ message: 'Member Account Cancelled' }]);
    } catch (err) {
      next(err);
    }
  },

  // @desc    Deletes a members notification - may not be used (CHECK)
  // @route   DELETE /api/v1/members/:id/notifications/:nId
  // @access  Private
  deleteNotification: async (req, res, next) => {
    try {
      const member = await Member.findById(req.params.id);
      if (!member)
        throw createError(400, 'Member with the given ID was not found');

      const filteredNotifications = member.notifications.filter(
        (notify) => notify._id != req.params.nId
      );
      member.notifications = filteredNotifications;
      await member.save();
      return res.status(200).send([{ message: 'Notification removed.' }]);
    } catch (err) {
      next(err);
    }
  },
};
