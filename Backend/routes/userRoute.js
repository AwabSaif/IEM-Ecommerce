const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  getUser,
  loggedinStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/userController");
const protect = require("../middleWare/authMiddleWare");

// register route
router.post("/register", registerUser);

// login route
router.post("/login", loginUser);
router.get("/logout", logout);

// User pofile
router.get("/getuser", protect, getUser);
router.get("/loggedin", loggedinStatus);
router.patch("/updateuser", protect,updateUser);

// Password stauts
router.patch("/changepassword", protect,changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;
