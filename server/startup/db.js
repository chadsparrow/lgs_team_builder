const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const logger = require('../middleware/logger');
const { Member } = require('../models/Member');

module.exports = async function(DB_HOST) {
  // connects to mongodb
  const conn = await mongoose.connect(DB_HOST, {
    useNewUrlParser: true,
    autoReconnect: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  });
  logger.info(`Connected to MongoDB..${conn.connection.host}`);

  // disconnects from mongodb if requested by SIGINT call
  process.on('SIGINT', async () => {
    logger.info('Disconnecting from MongoDB..');
    await mongoose.disconnect();
    process.exit(0);
  });

  // checks if the database has a single admin - if not it creates it from env variables
  const admins = await Member.find({ isAdmin: true });
  if (admins && admins.length === 0) {
    logger.info('No admin users detected - creating root user.');
    const rootPass = process.env.MONGO_INITDB_ROOT_PASS;
    const rootEmail = process.env.MONGO_INITDB_ROOT_EMAIL;
    const newAdmin = new Member({
      email: rootEmail,
      name: 'rootuser',
      address1: '123 Any Street',
      city: 'city',
      stateProv: 'state_prov',
      country: 'country',
      zipPostal: 'zip_postal',
      phone: '1111111111',
      location: {
        type: 'Point',
        coordinates: [0, 0]
      },
      timezone: 'America/Vancouver',
      isAdmin: true,
      isVerified: true
    });
    const salt = await bcrypt.genSalt(10);
    newAdmin.password = await bcrypt.hash(rootPass, salt);
    await newAdmin.save();
    logger.info('Root Admin user created.');
  }
};
