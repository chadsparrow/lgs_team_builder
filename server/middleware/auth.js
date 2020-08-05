const jwt = require('jsonwebtoken');
const { Member } = require('../models/Member');

module.exports = function (req, res, next) {
  const bearerToken = req.header('Authorization');
  if (!bearerToken)
    return res
      .status(401)
      .send([{ message: 'Access Denied. No token provided.' }]);

  const token = bearerToken.split(' ')[1];

  jwt.verify(token, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
    if (err) {
      if (err.message === 'jwt expired') {
        return res.status(401).send([{ message: 'Access Token Expired.' }]);
      } else {
        return res
          .status(401)
          .send([{ message: 'Access Denied. Invalid token.' }]);
      }
    }

    req.member = decoded;

    const member = await Member.findById(req.member._id);
    if (!member) return res.status(401).send([{ message: 'Invalid User ID' }]);

    req.member.isAdmin = member.isAdmin;

    next();
  });
};
