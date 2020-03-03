const jwt = require('jsonwebtoken');
const { Member } = require('../models/Member');

module.exports = async function(req, res, next) {
  const token = req.header('Authorization');
  if (!token)
    return res
      .status(401)
      .send([{ message: 'Access Denied. No token provided.' }]);

  const tokenArray = token.split(' ');

  try {
    req.member = jwt.verify(tokenArray[1], process.env.JWT_PRIVATE_KEY);
    const member = await Member.findById(req.member._id);
    if (!member) return res.status(401).send([{ message: 'Invalid User ID' }]);
    req.member.isAdmin = member.isAdmin;
    next();
  } catch (err) {
    if (err.message === 'jwt expired') {
      res.status(401).send([{ message: 'Access Token Expired.' }]);
    } else {
      res.status(401).send([{ message: 'Access Denied. Invalid token.' }]);
    }
  }
};
