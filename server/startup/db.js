const winston = require('winston');
const mongoose = require('mongoose');
const { Admin } = require('../models/Admin');
const config = require('config');
const bcrypt = require('bcryptjs');

module.exports = async function(DB_HOST) {
  await mongoose.connect(DB_HOST, { useNewUrlParser: true, autoReconnect: true, useFindAndModify: false, useCreateIndex: true });
  winston.info('Connected to MongoDB..');

  const admins = await Admin.find();
  if (admins && admins.length === 0) {
    winston.info('No admin users detected - creating root user.');
    const rootPass = config.get('app.rootPass');
    const newAdmin = new Admin({
      name: 'root',
      phone: '555-555-1212',
      office: 'AI',
      email: 'root@teambuilder.io'
    });
    const salt = await bcrypt.genSalt(10);
    newAdmin.password = await bcrypt.hash(rootPass, salt);
    await newAdmin.save();
    winston.info('Root Admin user created.');
  }
};
