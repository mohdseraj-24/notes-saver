const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentication required.' });
  }

  try {
    const decoded = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    res.status(401).json({ message: 'Your session has expired. Please sign in again.' });
  }
};
