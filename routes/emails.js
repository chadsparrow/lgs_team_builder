/* eslint-disable no-underscore-dangle */
const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

const aqp = require('api-query-params');
const { Email, validateEmail, validateMessage } = require('../models/Email');
const { Member } = require('../models/Member');

const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');

function populateEmail(emailId) {
  return new Promise(async resolve => {
    const populatedEmail = await Email.findById(emailId)
      .populate({ path: 'senderId', select: 'name email' })
      .populate({ path: 'recipients.memberId', select: 'name email' })
      .populate({ path: 'messages.senderId', select: 'name email' })
      .select('_id senderId subject recipients messages updatedAt createdAt');
    resolve(populatedEmail);
  });
}

// GET /api/emails/admin?query
router.get('/admin', [auth, admin], async (req, res) => {
  const { filter } = aqp(req.query);
  const emails = await Email.find(filter);

  if (emails && emails.length === 0) return res.status(404).send([{ message: 'No emails found.' }]);

  return res.send(emails);
});

// GET /api/emails
router.get('/', auth, async (req, res) => {
  const emails = await Email.find({
    $or: [
      { recipients: { $elemMatch: { memberId: mongoose.Types.ObjectId(req.member._id) } } },
      { messages: { $elemMatch: { senderId: mongoose.Types.ObjectId(req.member._id) } } }
    ]
  })
    .populate({ path: 'senderId', select: 'name email' })
    .populate({ path: 'recipients.memberId', select: 'name email' })
    .populate({ path: 'messages.senderId', select: 'name email' })
    .sort('-messages.date')
    .select('-__v -teamId');

  if (emails.length === 0) return res.status(404).send([{ message: 'You have no messages.' }]);
  return res.send(emails);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send(error.details);

  const recipients = [];

  const sender = await Member.findById(req.member._id);
  if (!sender)
    return res.status(400).send({[
      message: `Sender with a given ID (${req.member._id}) was not found. Please try again.`
    }]);

  recipients.push({ memberId: req.member._id, unread: false });

  // eslint-disable-next-line consistent-return
  req.body.recipients.forEach(async recipient => {
    const member = await Member.findById(recipient);
    if (!member)
      return res.status(400).send([{
        message: `Recipient with the given ID (${recipient}) was not found. Please try again.`
      }]);
    recipients.push({ memberId: recipient });
  });

  const newEmail = new Email({
    senderId: req.member._id,
    subject: req.body.subject,
    recipients,
    teamId: req.body.teamId
  });

  newEmail.messages.push({
    message: req.body.message,
    date: new Date(),
    senderId: req.member._id
  });

  const savedEmail = await newEmail.save();
  const populatedEmail = await populateEmail(savedEmail._id);

  return res.send(populatedEmail);
});

// Toggle Unread boolean on an email.
router.patch('/:id/tr', [validateObjectId, auth], async (req, res) => {
  const member = await Member.findById(req.member._id);
  if (!member) return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  const email = await Email.findById(req.params.id);
  if (!email) return res.status(400).send([{ message: 'Email with the given ID was not found.' }]);

  email.recipients.forEach((recipient, index) => {
    if (recipient.memberId === req.member._id) {
      email.recipient[index].unread = !recipient.unread;
    }
  });

  const savedEmail = await email.save();
  const populatedEmail = await populateEmail(savedEmail._id);

  return res.send(populatedEmail);
});

router.patch('/:id/archive', [validateObjectId, auth], async (req, res) => {
  const member = await Member.findById(req.member._id);
  if (!member) return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  const email = await Email.findById(req.params.id);
  if (!email) return res.status(400).send([{ message: `Email with the given ID was not found.` }]);

  // eslint-disable-next-line consistent-return
  email.recipients.forEach((recipient, index) => {
    if (recipient.memberId === req.member._id && !recipient.archived) {
      email.recipients[index].archived = true;
    }

    if (recipient.memberId === req.member._id && recipient.archived) {
      return res.status(400).send([{ message: 'Email with the given ID is already archived.' }]);
    }
  });

  const savedEmail = await email.save();
  const populatedEmail = await populateEmail(savedEmail._id);

  return res.send(populatedEmail);
});

router.post('/:id/reply', [validateObjectId, auth], async (req, res) => {
  const { error } = validateMessage(req.body);
  if (error) return res.status(400).send(error.details);

  const member = await Member.findById(req.member._id);
  if (!member) return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);

  const email = await Email.findById(req.params.id);
  if (!email) return res.status(400).send([{ message: `Email with the given ID was not found.` }]);

  const newMessage = {
    message: req.body.message,
    senderId: req.member._id,
    date: new Date()
  };

  email.messages.push(newMessage);

  email.recipients.forEach((recipient, index) => {
    if (recipient.memberId !== req.member._id) {
      email.recipients[index].unread = true;
    }
    email.recipients[index].archived = false;
  });

  const savedEmail = await email.save();
  const populatedEmail = await populateEmail(savedEmail._id);

  return res.send(populatedEmail);
});

module.exports = router;
