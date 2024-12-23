// middleware/author.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Secret key from environment variables
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key_here';

// Middleware to check if the user is an author
const authorMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }

    // Assuming you add an "isAuthor" field to your JWT payload when the user logs in
    if (decoded.isAuthor) {
      req.user = decoded; // Attach the decoded user data to the request object
      next(); // Call the next middleware/route handler
    } else {
      return res.status(403).json({ message: 'Access denied: Not an author' });
    }
  });
};

module.exports = authorMiddleware;
