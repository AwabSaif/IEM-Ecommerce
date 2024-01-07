const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.JWT_SECRET;
  const api = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      `${api}/users/login`,
      `${api}/users/register`,
      `${api}/users/updateuser/`, 
      `${api}/users/changepassword/`, 
      `${api}/users/forgotPassword`, 
      `${api}/users/resetpassword/:resetToken`, 
      `${api}/users/confirm/:tToken`, 
    ],
  });
}

async function isRevoked(req, token) {
  try {
    if (token.payload.isAdmin == false) {
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error in isRevoked:", error);
    return true;
  }
}

const authErrorHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "The user is not authorized" });
  }

  if (err.name === "ValidationError") {
    //  validation error
    return res.status(401).json({ message: err });
  }

  // default to 500 server error
  return res.status(500).json(err);
  0;
};

module.exports = { authJwt, authErrorHandler };
