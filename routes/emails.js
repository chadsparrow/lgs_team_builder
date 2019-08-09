const { Email, validateEmail, validateMessage } = require('../models/Email');
const { Member } = require('../models/Member');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const mongoose = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId');
const aqp = require('api-query-params');

// GET /api/emails/admin?query
router.get('/admin', [auth, admin], async (req, res) => {
  const { filter } = aqp(req.query);
  const emails = await Email.find(filter);

  if (emails && emails.length === 0) return res.status(404).json({ message: 'No emails found.' });

  res.json(emails);
});

// GET /api/emails
router.get('/', auth, async (req, res) => {
  const emails = await Email.find({
    $or: [
      { recipients: { $elemMatch: { member_id: mongoose.Types.ObjectId(req.member._id) } } },
      { messages: { $elemMatch: { sender_id: mongoose.Types.ObjectId(req.member._id) } } }
    ]
  })
    .populate({ path: 'sender_id', select: 'name email' })
    .populate({ path: 'recipients.member_id', select: 'name email' })
    .populate({ path: 'messages.sender_id', select: 'name email' })
    .sort('-messages.date')
    .select('-__v -team_id');

  if (emails.length === 0) return res.status(404).json({ message: 'You have no messages.' });
  res.json(emails);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).json(error.details);

  let recipients = [];

  let sender = await Member.findById(req.member._id);
  if (!sender) return res.status(400).json({ message: `Sender with a given ID (${req.member._id}) was not found. Please try again.` });

  recipients.push({ member_id: req.member._id, unread: false });

  req.body.recipients.forEach(async recipient => {
    let member = await Member.findById(recipient);
    if (!member) return res.status(400).json({ message: `Recipient with the given ID (${recipient}) was not found. Please try again.` });
    recipients.push({ member_id: recipient });
  });

  let new_email = new Email({
    sender_id: req.member._id,
    subject: req.body.subject,
    recipients: recipients,
    team_id: req.body.team_id
  });

  new_email.messages.push({ message: req.body.message, date: new Date(), sender_id: req.member._id });

  let saved_email = await new_email.save();
  let populated_email = await populateEmail(saved_email._id);

  res.json(populated_email);
});

// Toggle Unread boolean on an email.
router.patch('/:id/tr', [validateObjectId, auth], async (req, res) => {
  let member = await Member.findById(req.member._id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });

  let email = await Email.findById(req.params.id);
  if (!email) return res.status(400).json({ message: 'Email with the given ID was not found.' });

  email.recipients.forEach(recipient => {
    if (recipient.member_id == req.member._id) {
      recipient.unread = !recipient.unread;
    }
  });

  let saved_email = await email.save();
  let populated_email = await populateEmail(saved_email._id);

  res.json(populated_email);
});

router.patch('/:id/archive', [validateObjectId, auth], async (req, res) => {
  let member = await Member.findById(req.member._id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });

  let email = await Email.findById(req.params.id);
  if (!email) return res.status(400).json({ message: `Email with the given ID was not found.` });

  email.recipients.forEach(recipient => {
    if (recipient.member_id == req.member._id && !recipient.archived) {
      recipient.archived = true;
    } else if (recipient.member_id == req.member._id && recipient.archived) {
      return res.status(400).json({ message: 'Email with the given ID is already archived.' });
    }
  });

  let saved_email = await email.save();
  let populated_email = await populateEmail(saved_email._id);

  res.json(populated_email);
});

router.post('/:id/reply', [validateObjectId, auth], async (req, res) => {
  const { error } = validateMessage(req.body);
  if (error) return res.status(400).json(error.details);

  let member = await Member.findById(req.member._id);
  if (!member) return res.status(400).json({ message: 'Member with the given ID was not found.' });

  let email = await Email.findById(req.params.id);
  if (!email) return res.status(400).json({ message: `Email with the given ID was not found.` });

  let newMessage = {
    message: req.body.message,
    sender_id: req.member._id,
    date: new Date()
  };

  email.messages.push(newMessage);

  let reset_unread = email.recipients.map(recipient => {
    if (recipient.member_id != req.member._id) {
      recipient.unread = true;
    }
    recipient.archived = false;
    return recipient;
  });

  email.recipients = reset_unread;

  let saved_email = await email.save();
  let populated_email = await populateEmail(saved_email._id);

  res.json(populated_email);
});

function populateEmail(email_id) {
  return new Promise(async (resolve, reject) => {
    let popemail = await Email.findById(email_id)
      .populate({ path: 'sender_id', select: 'name email' })
      .populate({ path: 'recipients.member_id', select: 'name email' })
      .populate({ path: 'messages.sender_id', select: 'name email' })
      .select('_id sender_id subject recipients messages updatedAt createdAt');
    resolve(popemail);
  });
}

module.exports = router;
