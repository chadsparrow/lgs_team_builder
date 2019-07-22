const { Email, validateEmail, validateMessage } = require('../models/Email');
const { Member } = require('../models/Member');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const _ = require('lodash');
const mongoose = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId');

// GET /api/notifcations/me
router.get('/me', auth, async (req, res) => {
  const emails = await Email.find({
    $or: [
      { recipients: { $elemMatch: { member: mongoose.Types.ObjectId(req.member._id) } } },
      { messages: { $elemMatch: { sentBy: mongoose.Types.ObjectId(req.member._id) } } }
    ]
  })
    .populate({ path: 'sender', select: 'name email' })
    .populate({ path: 'recipients.member', select: 'name email' })
    .populate({ path: 'messages.sentBy', select: 'name email' })
    .sort('-messages.date')
    .select('-__v');

  if (emails.length === 0) return res.status(404).send({ msg: 'You have no messages.' });
  res.send(emails);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateEmail(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let recipients = [];

  let sender = await Member.findById(req.member._id);
  if (!sender) return res.status(400).send({ msg: `Sender with a given ID (${req.member._id}) was not found. Please try again.` });

  recipients.push({ member: req.member._id, unread: false });

  req.body.recipients.forEach(async recipient => {
    let member = await Member.findById(recipient);
    if (!member) return res.status(400).send({ msg: `Recipient with the given ID (${recipient}) was not found. Please try again.` });
    recipients.push({ member: recipient });
  });

  const newEmail = new Email({
    sender: req.member._id,
    subject: req.body.subject,
    recipients: recipients
  });

  newEmail.messages.push({ message: req.body.message, date: new Date(), sentBy: req.member._id });

  let savedEmail = await email.save();
  let populatedEmail = await populateEmail(savedEmail._id);

  res.send(populatedEmail);
});

// Toggle Unread boolean on an email.
router.patch('/:id/tr', [validateObjectId, auth], async (req, res) => {
  let member = await Member.findById(req.member._id);
  if (!member) return res.status(400).send({ msg: 'Member with the given ID was not found.' });

  let email = await Email.findById(req.params.id);
  if (!email) return res.status(400).send({ msg: 'Email with the given ID was not found.' });

  email.recipients.forEach(recipient => {
    if (recipient.member == req.member._id) {
      recipient.unread = !recipient.unread;
    }
  });

  let savedEmail = await email.save();
  let populatedEmail = await populateEmail(savedEmail._id);

  res.send(populatedEmail);
});

router.patch('/:id/archive', [validateObjectId, auth], async (req, res) => {
  let member = await Member.findById(req.member._id);
  if (!member) return res.status(400).send({ msg: 'Member with the given ID was not found.' });

  let email = await Email.findById(req.params.id);
  if (!email) return res.status(400).send({ msg: `Email with the given ID was not found.` });

  email.recipients.forEach(recipient => {
    if (recipient.member == req.member._id && !recipient.archived) {
      recipient.archived = true;
    } else if (recipient.member == req.member._id && recipient.archived) {
      return res.status(400).send({ msg: 'Email with the given ID is already archived.' });
    }
  });

  let savedEmail = await email.save();
  let populatedEmail = await populateEmail(savedEmail._id);

  res.send(populatedEmail);
});

router.post('/:id/reply', [validateObjectId, auth], async (req, res) => {
  const { error } = validateMessage(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let member = await Member.findById(req.member._id);
  if (!member) return res.status(400).send({ msg: 'Member with the given ID was not found.' });

  let email = await Email.findById(req.params.id);
  if (!email) return res.status(400).send({ msg: `Email with the given ID was not found.` });

  let newMessage = {
    message: req.body.message,
    sentBy: req.member._id,
    date: new Date()
  };

  email.messages.push(newMessage);

  let resetUnread = email.recipients.map(recipient => {
    if (recipient.member != req.member._id) {
      recipient.unread = true;
    }
    recipient.archived = false;
    return recipient;
  });

  email.recipients = resetUnread;

  let savedEmail = await email.save();
  let populatedEmail = await populateEmail(savedEmail._id);

  res.send(populatedEmail);
});

function populateEmail(emailId) {
  return new Promise(async (resolve, reject) => {
    let popemail = await Email.findById(emailId)
      .populate({ path: 'sender', select: 'name email' })
      .populate({ path: 'recipients.member', select: 'name email' })
      .populate({ path: 'messages.sentBy', select: 'name email' })
      .select('_id sender subject recipients messages updatedAt createdAt');
    resolve(popemail);
  });
}

module.exports = router;
