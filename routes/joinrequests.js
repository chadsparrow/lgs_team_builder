const { Team } = require('../models/Team');
const { Member, validateNotification } = require('../models/Member');
const { JoinRequest, validateJoinRequest } = require('../models/JoinRequests');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const _ = require('lodash');
const mongoose = require('mongoose');
const validateObjectId = require('../middleware/validateObjectId');

const populateOptions = { path: 'member_id', select: 'name email' };

router.get('/', auth, async (req, res) => {
  const joins = await JoinRequest.find().populate(populateOptions);
  if (joins && joins.length === 0) return res.status(404).json({ message: 'No join requests found.' });

  res.json(joins);
});

router.get('/team/:id', [validateObjectId, auth], async (req, res) => {
  const joins = await JoinRequest.find({ team_id: req.params.id }).populate(populateOptions);
  if (joins && joins.length === 0) return res.status(400).json({ message: 'Team with the given ID not found.' });

  res.json(joins);
});

router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const join = await JoinRequest.findById(req.params.id).populate(populateOptions);
  if (!join) return res.status(400).json({ message: 'Join Request with the given ID not found.' });

  res.json(join);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateJoinRequest(req.body);
  if (error) return res.status(400).json(error.details);

  const requested_by = await Member.findById(req.body.member_id).select('name');
  if (!requested_by) return res.status(400).json({ message: 'Member with the given ID not found' });

  const newJoin = new JoinRequest({
    member_id: req.body.member_id,
    team_id: req.body.team_id
  });

  const send_notification_to = await Team.findById(req.body.team_id).select('admin_id manager_id');

  const newNotification = {
    recipients: [send_notification_to.admin_id, send_notification_to.manager_id],
    message: `${requested_by.name} wants to join your team!`,
    click_to: `/api/v1/joinrequests/${newJoin._id}`
  };

  for (recipient of req.body.recipients) {
    let member = await Member.findById(recipient);
    if (member) {
      member.notifications.push(newNotification);
      await member.save();
    }
  }

  await newJoin.save();

  res.status(200).json({ message: 'Request sent.' });
});

module.exports = router;
