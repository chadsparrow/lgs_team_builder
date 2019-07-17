const _ = require("lodash");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

const { Admin, validateNewAdmin, validateAdminPassword } = require("../models/Admin");

// GET /api/admins
router.get("/", [auth, admin], async (req, res) => {
  const admins = await Admin.find().select("-password -__v -updatedAt -notifications");
  if (admins && admins.length === 0) return res.send({ msg: "There are no admins in the database." });
  res.send(admins);
});

// GET /api/admins/:id
router.get("/:id", [auth, admin], async (req, res) => {
  const admin = await Admin.findById(req.params.id).select("-password -__v -updatedAt -notifications");
  if (!admin) return res.status(400).send({ msg: "Admin with the given ID not found." });
  res.send(admin);
});

// POST /api/admins/register
router.post("/register", [auth, admin], async (req, res) => {
  const { error } = validateNewAdmin(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  let { name, phone, extension, office, email, password, avatar_url } = req.body;

  let admin = await Admin.findOne({ email });
  if (admin) return res.status(400).send({ msg: "Admin already registered." });

  const newAdmin = new Admin({
    name,
    phone,
    extension,
    office,
    email
  });

  newAdmin.notifications.push({ date: new Date(), message: "Welcome to Team Builder!" });

  const salt = await bcrypt.genSalt(10);
  newAdmin.password = await bcrypt.hash(password, salt);
  if (avatar_url) {
    newAdmin.avatar_url = avatar_url;
  }
  await newAdmin.save();

  res.send(_.pick(newAdmin, ["_id", "name", "email"]));
});

// PATCH /api/admins/password/:id
router.patch("/password/:id", auth, async (req, res) => {
  const { error } = validateAdminPassword(req.body);
  if (error) return res.status(400).send({ msg: error.details[0].message });

  if (req.body.newpassword === req.body.oldpassword) return res.status(400).send({ msg: "Please ensure new password is different." });

  let admin = await Admin.findById(req.params.id);
  if (!admin) return res.status(404).send({ msg: "Admin with the given ID was not found." });

  bcrypt.compare(req.body.oldpassword, admin.password, (err, result) => {
    if (!result) return res.status(400).send({ msg: "Password incorrect." });

    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.newpassword, salt, async (err, hash) => {
        admin.password = hash;
        await admin.save();
        res.send(_.pick(admin, ["_id", "name", "email"]));
      });
    });
  });
});

module.exports = router;
