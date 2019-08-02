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

const popOtions = { path: 'requestBy', select: 'name email' };

router.get('/', auth, async (req, res) => {
  const joins = await JoinRequest.find().populate(popOtions);
  if (joins && joins.length === 0) return res.status(404).send({ msg: 'No join requests found.' });

  res.send(joins);
});

router.get('/team/:id', [validateObjectId, auth], async (req, res) => {
  const joins = await JoinRequest.find({ team_id: req.params.id }).populate(popOtions);
  if (joins && joins.length === 0) return res.status(400).send({ msg: 'Team with the given ID not found.' });

  res.send(joins);
});

router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const join = await JoinRequest.findById(req.params.id).populate(popOtions);
  if (!join) return res.status(400).send({ msg: 'Join Request with the given ID not found.' });

  res.send(join);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateJoinRequest(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  const requestedBy = await Member.findById(req.body.requestBy).select('name');

  const newJoin = new JoinRequest({
    requestBy: req.body.requestBy,
    team_id: req.body.team_id
  });

  const sendTo = await Team.findById(req.body.team_id).select('admin_id manager_id');

  const newNotification = {
    recipients: [sendTo.admin_id, sendTo.manager_id],
    message: `${requestedBy.name} wants to join your team!`,
    clickTo: `/api/joinrequests/${newJoin._id}`
  };

  for (recipient of req.body.recipients) {
    let member = await Member.findById(recipient);
    if (member) {
      member.notifications.push(newNotification);
      await member.save();
    }
  }

  await newJoin.save();

  res.status(200).send({ msg: 'Request sent.' });
});

module.exports = router;
