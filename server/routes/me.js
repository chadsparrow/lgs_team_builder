const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

const { Member } = require("../models/Member");
const { Email } = require("../models/Email");

router.get("/", auth, async (req, res) => {
  const emails = await Email.find({
    $or: [
      { recipients: { $elemMatch: { member: mongoose.Types.ObjectId(req.member._id) } } },
      { messages: { $elemMatch: { sentBy: mongoose.Types.ObjectId(req.member._id) } } }
    ]
  })
    .populate({ path: "sender", select: "name email" })
    .populate({ path: "recipients.member", select: "name email" })
    .populate({ path: "messages.sentBy", select: "name email" })
    .sort("-messages.date")
    .select("-__v");

  const member = await Member.findById(req.member._id).select("-password -__v -updatedAt");
  return res.send({ member, emails });
});

module.exports = router;
