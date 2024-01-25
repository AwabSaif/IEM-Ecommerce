const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.ACCESS_TOKEN_SECRET;
  const api = process.env.API_URL;
  return jwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked,
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/products(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/categories(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/orders(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      { url: /\/api\/users\/confirm\/*/, methods: ["GET"] },
      `${api}/users/login`,
      `${api}/users/register`,
      `${api}/users/refresh/token`,
      // { url: /\/api\/users\/forgotpassword\/*/, methods: ["POST"] },
      // { url: /\/api\/users\/resetpassword\/*/, methods: ["PUT"] },
     /*  `${api}/users/updateuser`,
      `${api}/users/changepassword`,
      `${api}/users/logout`,
      `${api}/iem-contact-us`, */
      

    ],
  });
}

// revoke.js
async function isRevoked(req, token,done) {
 
  try {
    if (!token.payload.isAdmin) {
     
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
