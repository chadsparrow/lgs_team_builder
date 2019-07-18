const _ = require("lodash");
const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const mongoose = require("mongoose");

const { Admin } = require("../models/Admin");
const { Member } = require("../models/Member");
const { Email } = require("../models/Email");

router.get("/", auth, async (req, res) => {
  const emails = await Email.find({
    $or: [
      { recipients: { $elemMatch: { member: mongoose.Types.ObjectId(req.member._id) } } },
      { messages: { $elemMatch: { sentBy: mongoose.Types.ObjectId(req.member._id) } } }
    ]
  })
    .populate("sender", "name email", Member)
    .populate("recipients.member", "name email", Member)
    .populate("messages.sentBy", "name email", Member)
    .sort("-messages.date")
    .select("-__v");

  if (req.member.admin) {
    const admin = await Admin.findById(req.member._id).select("-password -__v -updatedAt");
    return res.send({ admin, emails });
  } else {
    const member = await Member.findById(req.member._id).select("-password -__v -updatedAt");
    return res.send({ member, emails });
  }
});

module.exports = router;
