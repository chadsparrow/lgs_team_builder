/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const express = require('express');
const generator = require('generate-password');

const router = express.Router();
const bcrypt = require('bcryptjs');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const { Team } = require('../models/Team');

const {
  Member,
  validateNewMember,
  validateUpdateMember,
  validateEmail,
  validatePassword
} = require('../models/Member');

// GET /api/v1/members
router.get('/', [auth, admin], async (req, res) => {
  const members = await Member.find({ _id: { $ne: req.member._id }, closedAccount: false })
    .select('_id name email isAdmin invites')
    .sort({ name: 1 });

  if (members && members.length === 0)
    return res.status(404).send([{ message: 'There are no members in the database.' }]);

  return res.send(members);
});

router.get('/admins', auth, async (req, res) => {
  const admins = await Member.find({ isAdmin: true, closedAccount: false }).select(
    '_id name email'
  );
  return res.status(200).send(admins);
});

// GET /api/v1/members/:id
router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const member = await Member.findById(req.params.id).select(
    '_id name email createdAt timezone isAdmin'
  );
  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  return res.send(member);
});

// GET /api/v1/members/:id/details
router.get('/:id/details', [validateObjectId, auth], async (req, res) => {
  const member = await Member.findById(req.params.id).select(
    '-__v -updatedAt -password -notifications'
  );

  const teams = await Team.find({ members: req.params.id }).select('name _id');

  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  return res.send({ member, teams });
});

router.get('/:id/me', [validateObjectId, auth], async (req, res) => {
  const me = await Member.findById(req.params.id).select('-__v -updatedAt -password');
  return res.status(200).send(me);
});

router.post('/:id/invite', [validateObjectId, auth], async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(400).send([{ message: 'Member with the given ID not found' }]);
  const team = await Team.findById(req.body.team);
  if (!team) return res.status(400).send([{ message: 'Team with the given ID not found' }]);

  if (!member.invites.invitations.includes(req.body.team)) {
    member.invites.invitations.push(req.body.team);
    member.notifications.push({
      date: Date.now(),
      message: `You have an inviation to join Team ${team.name}`,
      clickTo: `/dashboard/teams/${team._id}`
    });
    await member.save();
    return res.status(200).send([{ message: 'Invitation Sent' }]);
  }
  return res.status(400).send([{ message: 'Invitation already sent - awaiting response' }]);
});

// POST /api/members
router.post('/register', [auth, admin], async (req, res) => {
  const { error } = validateNewMember(req.body);
  if (error) return res.status(400).send(error.details);

  const {
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
    timezone,
    timezoneAbbrev,
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
  } = req.body;

  const member = await Member.findOne({ email });
  if (member) return res.status(400).send([{ message: 'Member already registered.' }]);

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
    timezone,
    timezoneAbbrev,
    isAdmin: false
  });

  newMember.notifications.push({ date: new Date(), message: 'Welcome to Team Builder!' });
  const password = generator.generate({ length: 10, numbers: true });
  const salt = await bcrypt.genSalt(10);
  newMember.password = await bcrypt.hash(password, salt);

  if (shippingSame) {
    newMember.shipping.name = newMember.name;
    newMember.shipping.company = newMember.company;
    newMember.shipping.address1 = newMember.address1;
    newMember.shipping.address2 = newMember.address2;
    newMember.shipping.city = newMember.city;
    newMember.shipping.stateProv = newMember.stateProv;
    newMember.shipping.country = newMember.country;
    newMember.shipping.zipPostal = newMember.zipPostal;
    newMember.shipping.phone = newMember.phone;
    newMember.shipping.email = newMember.email;
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
    newMember.billing.name = newMember.name;
    newMember.billing.company = newMember.company;
    newMember.billing.address1 = newMember.address1;
    newMember.billing.address2 = newMember.address2;
    newMember.billing.city = newMember.city;
    newMember.billing.stateProv = newMember.stateProv;
    newMember.billing.country = newMember.country;
    newMember.billing.zipPostal = newMember.zipPostal;
    newMember.billing.phone = newMember.phone;
    newMember.billing.email = newMember.email;
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

  await newMember.save();

  return res.status(201).send([{ message: 'Member Registered' }]);
});

// PUT /api/members/:id
router.put('/:id', [validateObjectId, auth], async (req, res) => {
  const { error } = validateUpdateMember(req.body);
  if (error) return res.status(400).send(error.details);
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
    timezone,
    timezoneAbbrev,
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
    disabled,
    autoAccept
  } = req.body;

  const updateMember = await Member.findById(req.params.id);
  if (!updateMember)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  updateMember.name = name;
  updateMember.company = company;
  updateMember.address1 = address1;
  updateMember.address2 = address2;
  updateMember.city = city;
  updateMember.stateProv = stateProv;
  updateMember.country = country;
  updateMember.zipPostal = zipPostal;
  updateMember.phone = phone;
  updateMember.timezone = timezone;
  updateMember.timezoneAbbrev = timezoneAbbrev;
  updateMember.invites.disabled = disabled;
  updateMember.invites.autoAccept = autoAccept;

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
    email: updateMember.email
  };

  const teamsToUpdate = await Team.find({
    $or: [{ 'mainContact.email': updateMember.email }, { 'bulkShipping.email': updateMember.email }]
  });

  if (teamsToUpdate && teamsToUpdate.length > 0) {
    teamsToUpdate.forEach(async team => {
      if (team.mainContact.email === updateMember.email) {
        await Team.updateOne({ _id: team._id }, { $set: { mainContact: updateMemberMainContact } });
      }

      if (team.bulkShipping.email === updateMember.email) {
        await Team.updateOne(
          { _id: team._id },
          {
            $set: {
              bulkShipping: updateMember.shipping,
              timezone: updateMember.timezone,
              timezoneAbbrev: updateMember.timezoneAbbrev
            }
          }
        );
      }
    });
  }

  return res.status(200).send([{ message: 'Member Updated' }]);
});

// PATCH /api/members/:id/email
router.patch('/email/:id', [validateObjectId, auth], async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error.details);

  const { currentEmail, newEmail } = req.body;

  const member = await Member.findById(req.params.id);
  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  if (member.email === newEmail) {
    return res
      .status(400)
      .send([
        { message: 'Email is identical to what is already set.', context: { key: 'newEmail' } }
      ]);
  }

  const emailCheck = await Member.findOne({
    _id: { $ne: req.params.id },
    email: newEmail
  });

  if (emailCheck) {
    return res
      .status(400)
      .send([{ message: 'New email address already taken', context: { key: 'newEmail' } }]);
  }

  member.email = newEmail;

  if (member.billing.email === currentEmail) {
    member.billing.email = newEmail;
  }

  if (member.shipping.email === currentEmail) {
    member.shipping.email = newEmail;
  }

  await member.save();

  await Team.updateMany({ 'mainContact.email': currentEmail }, { 'mainContact.email': newEmail });
  await Team.updateMany({ 'bulkShipping.email': currentEmail }, { 'bulkShipping.email': newEmail });

  return res
    .status(200)
    .send([{ message: 'Email address updated - this will be your new login.' }]);
});

// PATCH /api/v1/members/admin/:id
router.patch('/admin/:id', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(400).send([{ message: 'Member with the given ID not found.' }]);

  member.isAdmin = !member.isAdmin;

  await member.save();

  return res.status(200).send([{ message: 'Member Updated' }]);
});

// PATCH /api/members/password/:id
router.patch('/password/:id', [validateObjectId, auth], async (req, res) => {
  const { error } = validatePassword(req.body);
  if (error) return res.status(400).send(error.details);

  const { oldPassword, newPassword } = req.body;

  const member = await Member.findById(req.params.id);
  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  const result = await bcrypt.compare(oldPassword, member.password);
  if (!result) return res.status(400).send([{ message: 'Old Password incorrect.' }]);

  const userEmail = member.email.split('@')[0];

  if (newPassword.includes('password'))
    return res.status(400).send([{ message: "Please do not use 'password' in your NEW password" }]);
  if (newPassword.includes(userEmail))
    return res
      .status(400)
      .send([{ message: 'Please do not use your email username in your NEW password' }]);

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);

  member.password = hash;
  await member.save();

  return res.status(200).send([{ message: 'Member password updated' }]);
});

// DELETE /api/members/:id
router.delete('/:id', [validateObjectId, auth, admin], async (req, res) => {
  const member = await Member.updateOne({ _id: req.params.id }, { closedAccount: true });
  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  const teams = await Team.find({ 'managerId._id': req.params.id });
  if (teams && teams.length > 0)
    return res
      .status(400)
      .send([{ message: 'Contact your Team Admin to select a new Team Manager first' }]);

  await Team.updateMany({ members: req.params.id }, { $pull: { members: req.params.id } });

  return res.status(200).send([{ message: 'Member Account Cancelled' }]);
});

router.delete('/:id/notification/:nId', auth, async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  // eslint-disable-next-line eqeqeq
  const filteredNotifications = member.notifications.filter(notify => notify._id != req.params.nId);
  member.notifications = filteredNotifications;
  await member.save();
  return res.status(200).send([{ message: 'Notification removed.' }]);
});

module.exports = router;
