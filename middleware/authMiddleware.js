const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Loads environment variables from .env file

const authMiddleware = (req, res, next) => {
  // Retrieve the token from the Authorization header
  const token = req.header('Authorization')?.split(' ')[1]; // Expected format: "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the decoded payload (e.g., id, role) to the request object
    next();
  } catch (err) {
    return res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authMiddleware;
