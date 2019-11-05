/* eslint-disable func-names */
const mongoose = require('mongoose');
const config = require('config');
const bcrypt = require('bcryptjs');
const logger = require('../middleware/logger');
const { Member } = require('../models/Member');

module.exports = async function(DB_HOST) {
  // connects to mongodb
  await mongoose.connect(DB_HOST, {
    useNewUrlParser: true,
    autoReconnect: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
  logger.info('Connected to MongoDB..');

  // disconnects from mongodb if requested by SIGINT call
  process.on('SIGINT', async () => {
    await mongoose.disconnect();
    process.exit(0);
  });

  // checks if the database has a single admin - if not it creates it from env variables
  const admins = await Member.find({ isAdmin: true });
  if (admins && admins.length === 0) {
    logger.info('No admin users detected - creating root user.');
    const rootPass = config.get('app.rootPass');
    const rootEmail = config.get('app.rootEmail');
    const newAdmin = new Member({
      name: 'rootuser',
      address1: '123 Any Street',
      city: 'city',
      stateProv: 'state_prov',
      country: 'country',
      zipPostal: 'zip_postal',
      phone: '1111111111',
      email: rootEmail,
      timezoneAbbrev: 'PST',
      timezone: 'America/Vancouver',
      shipping: {
        name: 'rootuser',
        address1: '123 Any Street',
        city: 'city',
        stateProv: 'stateProv',
        country: 'country',
        zipPostal: 'zipPostal',
        phone: '1111111111',
        email: rootEmail
      },
      isAdmin: true
    });
    const salt = await bcrypt.genSalt(10);
    newAdmin.password = await bcrypt.hash(rootPass, salt);
    await newAdmin.save();
    logger.info('Root Admin user created.');
  }
};
