const mongoose = require('mongoose');
const logger = require('../middleware/logger');
const { Member } = require('../models/Member');

module.exports = async function (DB_HOST) {
  // connects to mongodb
  const conn = await mongoose.connect(DB_HOST, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });
  if (!conn) {
    logger.error('MongoDB Connection Error');
    return process.exit(1);
  }

  logger.info(
    `Connected to MongoDB Atlas - ${conn.connection.host}.${conn.connection.name}`
  );

  // disconnects from mongodb if requested by SIGINT call
  process.on('SIGINT', async () => {
    logger.info('Disconnecting from MongoDB Atlas..');
    await mongoose.disconnect();
    return process.exit(0);
  });

  // checks if the database has a single admin - if not it creates it from env variables
  const admins = await Member.find({ isAdmin: true });
  if (admins && admins.length === 0) {
    logger.info('No admin users detected - creating root user.');
    const rootPass = process.env.MONGO_INITDB_ROOT_PASSWORD;
    const rootEmail = process.env.MONGO_INITDB_ROOT_EMAIL;

    const newAdmin = new Member({
      email: rootEmail,
      password: rootPass,
      name: 'rootuser',
      address1: '123 Any Street',
      city: 'city',
      stateProv: 'state_prov',
      country: 'country',
      zipPostal: 'zip_postal',
      phone: '1111111111',
      location: {
        type: 'Point',
        coordinates: [0, 0],
      },
      timezone: 'America/Vancouver',
      isAdmin: true,
      isVerified: true,
    });

    await newAdmin.save();
    logger.info('Root Admin user created.');
  }
};
