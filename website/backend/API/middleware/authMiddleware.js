const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';

exports.requireAuth = (req, res, next) => {
  const token = req.cookies?.auth_token;
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired authentication token' });
    }

    req.user = decoded;
    next();
  });
};
