const express = require('express');
const { Team } = require('../models/Team');
const { Member } = require('../models/Member');
const { JoinRequest, validateJoinRequest } = require('../models/JoinRequests');

const router = express.Router();
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

const populateOptions = { path: 'memberId', select: 'name email' };

router.get('/', auth, async (req, res) => {
  const joins = await JoinRequest.find().populate(populateOptions);
  if (joins && joins.length === 0)
    return res.status(404).json({ message: 'No join requests found.' });

  return res.json(joins);
});

router.get('/team/:id', [validateObjectId, auth], async (req, res) => {
  const joins = await JoinRequest.find({ teamId: req.params.id }).populate(populateOptions);
  if (joins && joins.length === 0)
    return res.status(400).json({ message: 'Team with the given ID not found.' });

  return res.json(joins);
});

router.get('/:id', [validateObjectId, auth], async (req, res) => {
  const join = await JoinRequest.findById(req.params.id).populate(populateOptions);
  if (!join) return res.status(400).json({ message: 'Join Request with the given ID not found.' });
  return res.json(join);
});

router.post('/', auth, async (req, res) => {
  const { error } = validateJoinRequest(req.body);
  if (error) return res.status(400).json(error.details);

  const requestedBy = await Member.findById(req.body.memberId).select('name');
  if (!requestedBy) return res.status(400).json({ message: 'Member with the given ID not found' });

  const newJoin = new JoinRequest({
    memberId: req.body.memberId,
    teamId: req.body.teamId
  });

  const sendTo = await Team.findById(req.body.teamId).select('adminId managerId');

  const newNotification = {
    recipients: [sendTo.adminId, sendTo.managerId],
    message: `${requestedBy.name} wants to join your team!`,
    // eslint-disable-next-line no-underscore-dangle
    clickTo: `/api/v1/joinrequests/${newJoin._id}`
  };

  req.body.recipients.map(async recipient => {
    const member = await Member.findById(recipient);
    if (member) {
      member.notifications.push(newNotification);
      await member.save();
    }
  });

  await newJoin.save();

  return res.status(200).json({ message: 'Request sent.' });
});

module.exports = router;
