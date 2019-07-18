const mongoose = require("mongoose");
const Joi = require("@hapi/joi");
const config = require("config");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 50,
      uppercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      minlength: 7,
      trim: true
    },
    extension: {
      type: String,
      trim: true
    },
    office: {
      type: String,
      trim: true,
      required: true,
      uppercase: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      trim: true
    },
    avatar_url: {
      type: String,
      trim: true
    },
    resetPasswordToken: {
      type: String
    },
    resetPasswordExpires: {
      type: Date
    },
    notifications: [
      {
        date: {
          type: Date,
          required: true
        },
        message: {
          type: String,
          required: true,
          trim: true
        },
        clickTo: {
          type: String
        }
      }
    ]
  },
  { timestamps: true }
);

function validateNewAdmin(admin) {
  const schema = {
    name: Joi.string()
      .required()
      .min(4)
      .max(50)
      .trim(),
    phone: Joi.string()
      .trim()
      .regex(/^[0-9]{7,10}$/)
      .required(),
    extension: Joi.string()
      .trim()
      .allow("", null),
    office: Joi.string()
      .trim()
      .required(),
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .trim()
      .min(8)
      .required(),
    confirm_password: Joi.string()
      .valid(Joi.ref("password"))
      .min(8)
      .required()
      .options({ language: { any: { allowOnly: "New Password and Confirm Passwords must match." } } }),
    avatar_url: Joi.string().allow("", null)
  };
  return Joi.validate(admin, schema);
}

function validateAdminPassword(admin) {
  const schema = {
    oldpassword: Joi.string()
      .min(8)
      .required()
      .trim(),
    newpassword: Joi.string()
      .min(8)
      .required()
      .trim(),
    confirmpassword: Joi.string()
      .valid(Joi.ref("newpassword"))
      .required()
      .options({ language: { any: { allowOnly: "New Password and Confirm Passwords must match." } } })
  };
  return Joi.validate(admin, schema);
}

AdminSchema.methods.generateAuthToken = function() {
  const token = jwt.sign({ _id: this._id, admin: true }, config.get("jwtPrivateKey"));
  return token;
};

exports.Admin = mongoose.model("admins", AdminSchema);
exports.validateNewAdmin = validateNewAdmin;
exports.validateAdminPassword = validateAdminPassword;
