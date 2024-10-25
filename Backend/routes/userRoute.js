const express = require("express"); // Import Express framework
const router = express.Router(); // Create a new router instance

// Import user controller functions
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
  activateUser,
  countUser,
  refreshTokenUser,
  logoutUser,
} = require("../controllers/userController");

// Define routes
router.get("/", getallUsers); // Route to get all users
router.get("/:id", getuser); // Route to get a specific user by ID
router.post("/", createUser); // Route to create a new user
router.put("/:id", updateUser); // Route to update a user by ID
router.post("/login", loginUser); // Route for user login
router.get("/refresh/token", refreshTokenUser); // Route to refresh user token
router.post("/logout", logoutUser); // Route to log out user
router.post("/register", registerUser); // Route to register a new user
router.delete("/:id", deleteUser); // Route to delete a user by ID
router.patch("/updateuser", editUser); // Route to edit user details
router.patch("/changepassword", changePassword); // Route to change user password
router.post("/forgotpassword", forgotPassword); // Route for password reset request
router.put("/resetpassword/:resetToken", resetPassword); // Route to reset user password
router.get("/confirm/:token", activateUser); // Route to confirm user activation
router.get("/get/count", countUser); // Route to get user count

// login route
router.post("/login", loginUser);
router.get("/logout", logout);

// User pofile
router.get("/getuser", protect, getUser);
router.get("/loggedin", loggedinStatus);
router.patch("/updateuser/:id", protect,updateUser);

// Password stauts
router.patch("/changepassword", protect,changePassword);
router.post("/forgotpassword", forgotPassword);
router.put("/resetpassword/:resetToken", resetPassword);

module.exports = router;
module.exports = router; // Export the router
