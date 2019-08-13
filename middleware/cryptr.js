const config = require('config');
const Cryptr = require('cryptr');

const cryptr = new Cryptr(config.get('jwtPrivateKey'));

module.exports = cryptr;
