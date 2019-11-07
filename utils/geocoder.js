const NodeGeocoder = require('node-geocoder');
// config to use env variables
const config = require('config');

const options = {
  provider: config.get('app.geocoderProvider'),
  httpAdapter: 'https',
  apiKey: config.get('app.geocoderKey'),
  formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
