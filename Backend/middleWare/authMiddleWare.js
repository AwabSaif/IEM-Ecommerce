const { expressjwt: jwt } = require("express-jwt");

// Middleware function for JWT authentication
function authJwt() {
  // Get secret and API URL from environment variables
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const api = process.env.API_URL;
  
  // Return JWT middleware configuration
  return jwt({
    secret,
    algorithms: ["HS256"], // Specify the allowed algorithms
    isRevoked: isRevoked, // Custom function to check if token is revoked
  }).unless({
    // Specify paths that do not require authentication
    path: [
      // Allow access to public uploads for GET and OPTIONS requests
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      // Allow access to product endpoints for GET and OPTIONS requests
      { url: /\/api\/products(.*)/, methods: ["GET", "OPTIONS"] },
      // Allow access to category endpoints for GET and OPTIONS requests
      { url: /\/api\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      // Allow access to order endpoints for GET, POST, and OPTIONS requests
      { url: /\/api\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      // Allow access to specific user endpoints for certain methods
      { url: /\/api\/users\/confirm\/*/, methods: ["GET"] },
      { url: /\/api\/users\/forgotpassword\/*/, methods: ["POST"] },
      { url: /\/api\/users\/resetpassword\/*/, methods: ["PUT"] },
      // Allow access to specific user endpoints for certain methods
      `${api}/users/login`,
      // `${api}/users/:id`,
      `${api}/users/register`,
      `${api}/users/refresh/token`,
      `${api}/users/updateuser`,
      `${api}/users/changepassword`,
      `${api}/users/logout`,
      `${api}/iem-contact-us`, 
    ],
  });
}

// Custom function to check if token is revoked
async function isRevoked(req, token, done) {
  try {
    // Check if user is not an admin
    if (!token.payload.isAdmin) {
      // If user is not admin, revoke token
      return true;
    }
    // If user is admin, do not revoke token
    return false;
  } catch (error) {
    // Handle errors
    console.error("Error in isRevoked:", error);
    return true;
  }
}

// Error handler for authentication middleware
const authErrorHandler = (err, req, res, next) => {
  // Handle UnauthorizedError
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: "The user is not authorized" });
  }

  // Handle ValidationError
  if (err.name === "ValidationError") {
    return res.status(401).json({ message: err });
  }

  // Default to 500 server error
  return res.status(500).json(err);
};

// Export middleware functions
module.exports = { authJwt, authErrorHandler };
