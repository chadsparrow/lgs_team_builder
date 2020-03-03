module.exports = function(req, res, next) {
  if (!req.member.isAdmin) return res.status(403).send([{ message: 'Access Denied.' }]);
  next();
};
