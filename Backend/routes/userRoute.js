const express = require("express");
const router = express.Router();
const {
  getallUsers,
  createUser,
  getuser,
  updateUser,
  loginUser,
  registerUser,
  deleteUser,
  editUser,
  changePassword,
  forgotPassword,
  resetPassword,
  activetUser,
  countUser,
} = require("../controllers/userController");





router.get("/", getallUsers);
router.get("/:id", getuser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.post("/login", loginUser);
router.post("/register", registerUser);
router.delete("/:id", deleteUser);
router.patch("/updateuser", editUser); 
router.patch("/changepassword", changePassword); 
router.post("/forgotpassword", forgotPassword); 
router.put("/resetpassword/:resetToken", resetPassword); 
router.get("/confirm/:tToken", activetUser); 
router.get("/get/count", countUser);

module.exports = router;
