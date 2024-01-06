const jwt = require("jsonwebtoken");

const unlessPaths =require("./authPaths");

const authJwt = async (req, res, next) => {
  try {
    const secret = process.env.JWT_SECRET;
    const jwtValidator = jwt.verify(
      req.headers["Authorization"],
      secret,
      { algorithms: ["HS256"] },
    );

    if (!jwtValidator) {
      return res.status(401).send("Unauthorized");
    }

    const payload = jwtValidator.payload;
    if (revokedUsers.has(payload.userId)) {
      return res.status(403).send("Forbidden");
    }

    // تحقق مما إذا كان المسار المراد الوصول إليه مدرجًا في المسارات التي لا تحتاج إلى مصادقة
    for (const path of unlessPaths) {
      if (path.url.test(req.url) && path.methods.includes(req.method)) {
        next();
        return;
      }
    }

    // إذا لم يكن المسار مدرجًا في المسارات التي لا تحتاج إلى مصادقة، فتحقق من المصادقة
    return next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Unauthorized" });
    } else {
      next(error);
    }
  }
};
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;
  res.status(statusCode);

  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "The user is not authorized" });
  }

  if (err.name === "ValidationError") {
    // validation error
    return res.status(400).json({ message: err });
  }

  // default to 500 server error
  return res.status(500).json(err);
};

module.exports = {
  authJwt,
  errorHandler,
};

/* 
const authJwt = async (req, res) => {
  const secret = process.env.JWT_SECRET;
  const api = process.env.API_URL;

  // تخزين قائمة بالمستخدمين الموقوفين في الذاكرة
  const revokedUsers = new Set();

  // إنشاء مُصدق JWT
  const jwtValidator = jwt.verify(req.headers["Authorization"], secret, {
    algorithms: ["HS256"],
  });

  // تحديد المسارات التي لا تحتاج إلى مصادقة
  const unlessPaths = [
    {
      url: /\/public\/uploads(.*)/,
      methods: ["GET", "OPTIONS"],
    },
    {
      url: /\/api\/product(.*)/,
      methods: ["GET", "OPTIONS"],
    },
    {
      url: /\/api\/categorie(.*)/,
      methods: ["GET", "OPTIONS"],
    },
    {
      url: /\/api\/order(.*)/,
      methods: ["GET", "OPTIONS", "POST"],
    },
    `${api}/user/login`,
    `${api}/user/register`,
  ];

  // التحقق من المصادقة
  if (!jwtValidator) {
    return res.status(401).send("Unauthorized");
  }

  // التحقق من أن المستخدم غير موقوف
  const payload = jwtValidator.payload;
  if (revokedUsers.has(payload.userId)) {
    return res.status(403).send("Forbidden");
  }

  // تم التحقق من المصادقة بنجاح
  return res.send(payload);
};
 */


/* const expressJwt = require('express-jwt');

const authJwt = async () => {
  const secret = process.env.JWT_SECRET;
  const api = process.env.API_URL;
  return expressJwt({
    secret,
    algorithms: ["HS256"],
    isRevoked: isRevoked, 
  }).unless({
    path: [
      { url: /\/public\/uploads(.*)/, methods: ["GET", "OPTIONS"] }, 
      { url: /\/api\/product(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/categorie(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/order(.*)/, methods: ["GET", "OPTIONS", "POST"] },
      `${api}/user/login`,
       `${api}/user/register`,
    ],
  });
};

async function isRevoked(req, payload, done) {
  if (!payload.isAdmin) {
    done(null, true);
  }

  done();
} 

module.exports = authJwt;
 */
