const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required.' });
      }
  
      // Check if the user's role matches the required role
      if (req.user.role !== requiredRole) {
        return res.status(403).json({ message: `Access forbidden. Requires ${requiredRole} role.` });
      }
  
      next();
    };
  };
  
  module.exports = roleMiddleware;
  