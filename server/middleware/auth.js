const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).send({ message: 'Access Denied. No token provided.' });
  const tokenArray = token.split(' ');

  try {
    req.member = jwt.verify(tokenArray[1], config.get('jwtPrivateKey'));
    next();
  } catch (err) {
    res.status(400).send({ message: 'Access Denied. Invalid token.' });
  }
};
