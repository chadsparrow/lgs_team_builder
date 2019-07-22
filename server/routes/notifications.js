const { Member, validateNotification } = require('../models/Member');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

// GET /api/notifcations/me
router.get('/me', auth, async (req, res) => {
  const member = await Member.findById(req.member._id);
  if (!member) return res.status(400).send({ msg: 'Member with the given ID was not found.' });
  res.send(member.notifications);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateNotification(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  const today = new Date();
  const newNotification = {
    date: today,
    message: req.body.message,
    clickTo: req.body.clickTo
  };

  for (recipient of req.body.recipients) {
    let member = await Member.findById(recipient);
    if (member) {
      member.notifications.push(newNotification);
      await member.save();
    }
  }
  res.end();
});

router.delete('/all', auth, async (req, res) => {
  let member = await Member.findById(req.member._id);
  member.notifications = [];
  await member.save();
  res.end();
});

router.delete('/:id', [validateObjectId, auth], async (req, res) => {
  let member = await Member.findById(req.member._id);
  if (member.notifications.length > 0) {
    member.notifications = member.notifications.filter(n => {
      return n._id != req.params.id;
    });
    await member.save();
    return res.send(member.notifications);
  }

  return res.status(400).send({ msg: 'Notifications with that ID not found.' });
});

module.exports = router;
