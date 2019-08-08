module.exports = function(req, res, next) {
  if (!req.member.is_admin) return res.status(403).json({ message: 'Access Denied.' });
  next();
};
