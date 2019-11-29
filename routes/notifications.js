const express = require('express');
const { Member, validateNotification } = require('../models/Member');

const router = express.Router();
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// GET /api/notifcations/me
// @desc    Gets all notifications for current user
// @route   GET /api/v1/notifications/me
// @access  Private
router.get('/me', auth, async (req, res) => {
  const member = await Member.findById(req.member._id);
  if (!member)
    return res.status(400).send([{ message: 'Member with the given ID was not found.' }]);
  return res.send(member.notifications);
});

// @desc    Adds a notification to all recipients in request body
// @route   POST /api/v1/notifications/
// @access  Private
router.post('/', auth, async (req, res) => {
  const { error } = validateNotification(req.body);
  if (error) return res.status(400).send(error.details);

  const today = new Date();
  const newNotification = {
    date: today,
    message: req.body.message,
    clickTo: req.body.clickTo
  };

  req.body.recipients.map(async recipient => {
    const member = await Member.findById(recipient);
    if (member) {
      member.notifications.push(newNotification);
      await member.save();
    }
  });

  return res.status(200).send([{ message: 'Notification sent' }]);
});

// @desc    Deletes all notifications for current member
// @route   DELETE /api/v1/notifications/all
// @access  Private
router.delete('/all', auth, async (req, res) => {
  const member = await Member.findById(req.member._id);
  member.notifications = [];
  await member.save();
  return res.status(200).send([{ message: 'Notifications cleared' }]);
});

// @desc    Deletes specific notification from current member
// @route   DELETE /api/v1/notifications/:id
// @access  Private
router.delete('/:id', [validateObjectId, auth], async (req, res) => {
  const member = await Member.updateOne(
    { _id: req.member._id },
    { $pull: { notifications: { _id: req.params.id } } }
  );
  if (!member)
    return res.status(400).send([{ message: 'Notification with the given ID not found' }]);

  return res.status(200).send([{ message: 'Notification deleted' }]);
});

module.exports = router;
