const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
const bcrypt = require('bcryptjs');
const { Member } = require('../models/Member');

module.exports = async function(DB_HOST) {
  await mongoose.connect(DB_HOST, { useNewUrlParser: true, autoReconnect: true, useFindAndModify: false, useCreateIndex: true });
  winston.info('Connected to MongoDB..');

  process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit(0);
  });

  const admins = await Member.find({ is_admin: true });
  if (admins && admins.length === 0) {
    winston.info('No admin users detected - creating root user.');
    const rootPass = config.get('app.rootPass');
    const rootEmail = config.get('app.rootEmail');
    const new_admin = new Member({
      name: 'rootuser',
      address1: '123 Any Street',
      city: 'city',
      state_prov: 'state_prov',
      country: 'country',
      zip_postal: 'zip_postal',
      phone: '1111111111',
      email: rootEmail,
      shipping_name: 'rootuser',
      shipping_address1: '123 Any Street',
      shipping_city: 'city',
      shipping_state_prov: 'state_prov',
      shipping_country: 'country',
      shipping_zip_postal: 'zip_postal',
      shipping_phone: '1111111111',
      shipping_email: rootEmail,
      is_admin: true
    });
    const salt = await bcrypt.genSalt(10);
    new_admin.password = await bcrypt.hash(rootPass, salt);
    await new_admin.save();
    winston.info('Root Admin user created.');
  }
};