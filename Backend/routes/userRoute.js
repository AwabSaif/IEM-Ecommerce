const express = require("express");
const router = express.Router();
const {
  getallUsers,
  createUser,
  getuser,
  loginUser,
} = require("../controllers/userController");
const {authJwt } = require("../middleWare/authMiddleWare");

router.use(authJwt);
router.get("/", getallUsers);
router.get("/:id", getuser);
router.post("/", createUser);
router.post("/login", loginUser);

module.exports = router;
