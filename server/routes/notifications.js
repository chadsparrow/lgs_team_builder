const { Member, validateNotification } = require('../models/Member');
const { Admin } = require('../models/Admin');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// GET /api/notifcations/me
router.get('/me', auth, async (req, res) => {
  if (req.member.admin) {
    const admin = await Admin.lookup(req.member._id);
    if (!admin) return res.status(400).send({ msg: 'Admin with the given ID was not found.' });
    return res.send(admin.notifications);
  }
  const member = await Member.lookup(req.member._id);
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
    let admin = await Admin.lookup(recipient);
    if (admin) {
      admin.notifications.push(newNotification);
      await admin.save();
    }

    let member = await Member.lookup(recipient);
    if (member) {
      member.notifications.push(newNotification);
      await member.save();
    }
  }
  res.end();
});

router.delete('/all', auth, async (req, res) => {
  if (req.member.admin) {
    let admin = await Admin.lookup(req.member._id);
    if (!admin) return res.status(400).send({ msg: 'Admin with the given ID was not found.' });

    admin.notifications = [];
    await admin.save();
    return res.end();
  }

  let member = await Member.lookup(req.member._id);
  member.notifications = [];
  await member.save();
  res.end();
});

router.delete('/:id', auth, async (req, res) => {
  if (req.member.admin) {
    let admin = await Admin.lookup(req.member._id);
    if (!admin) return res.status(400).send({ msg: 'Admin with the given ID was not found.' });

    if (admin.notifications.length > 0) {
      admin.notifications = admin.notifications.filter(n => {
        return n._id != req.params.id;
      });
      await admin.save();
      return res.send(admin.notifications);
    }
  }
  let member = await Member.lookup(req.member._id);
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
