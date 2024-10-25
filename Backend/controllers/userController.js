const asyncHandler = require("express-async-handler"); // Middleware for handling asynchronous functions
const { User } = require("../models/userModel"); // Importing the User model
const bcrypt = require("bcryptjs"); // Library for password hashing
const crypto = require("crypto"); // Library for cryptographic functions
const jwt = require("jsonwebtoken"); // Library for JSON Web Tokens
const { sendEmail, verifEmail } = require("../utils/emailService"); // Functions for sending emails
const Token = require("../models/tokenModle"); // Token model for managing authentication tokens

// Get all users
const getallUsers = asyncHandler(async (req, res) => {
  // Retrieve all users from the database
  const userList = await User.find().select("name email phone createdAt");
  if (!userList) {
    // If no users found, send a server error response
    res.status(500).json({ success: false });
  }
  // Send the list of users as a response
  res.status(200).send(userList);
});

// Get user by ID
const getuser = asyncHandler(async (req, res) => {
  // Find a user by their ID and exclude the password field
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    // If user not found, send a server error response
    res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }
  // Send the user as a response
  res.status(200).send(user);
});

// Create a new user
const createUser = asyncHandler(async (req, res) => {
  // Destructure request body to extract user details
  const {
    name,
    email,
    password,
    phone,
    isAdmin,
    street,
    apartment,
    verified,
    zip,
    city,
    country,
  } = req.body;
  if (!name || !email || !password || !phone) {
    // If required fields are missing, send a bad request response
    res.status(400).json({ message: "Please fill in all required fields" });
  }
  if (password.length < 6) {
    // If password length is less than 6 characters, send a bad request response
    res.status(400).json({ message: "Password must be up to 6 characters" });
  }
  // Check if the email already exists in the database
  const userExists = await User.findOne({ email });

  if (userExists) {
    // If email already exists, send a conflict response
    res.status(409).json({ message: "Email already exists" });
  }
  // Create a new user instance
  let user = new User({
    name,
    email,
    password,
    phone,
    isAdmin,
    verified,
    street,
    apartment,
    zip,
    city,
    country,
  });
  // Save the new user to the database
  user = await user.save();
  if (!user) {
    // If user creation fails, send a not found response
    return res.status(404).send("The user cannot be created!");
  }
  // Send the created user as a response
  res.send(user);
});

// Update user (for admin)
const updateUser = asyncHandler(async (req, res) => {
  // Find the user by ID
  const userExist = await User.findById(req.params.id);
  let newPassword;

  if (req.body.password) {
    // If a new password is provided, hash it
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  // Update user information
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      password: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      verified: req.body.verified,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("the user cannot be updated!");

  // Send the updated user as a response
  res.send(user);
});

// User login
const loginUser = asyncHandler(async (req, res) => {
  // Extract email and password from request body
  const { email, password } = req.body;

  if (!email || !password) {
    // If email or password is missing, send a bad request response
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }

  // Find user by email
  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    // If user not found, send an unauthorized response
    return res.status(401).json({ message: "Email does not exist" });
  }

  // Check if user is verified
  if (!foundUser.verified) {
    // If user is not verified, send a bad request response
    return res
      .status(400)
      .json({ message: "You need to verify your email before logging in." });
  }

  // Check if password is correct
  const passwordIsCorrect = await bcrypt.compareSync(
    password,
    foundUser.password
  );

  if (!passwordIsCorrect)
    // If password is incorrect, send a bad request response
    return res.status(400).json({ message: "Invalid email or password." });

  // Generate access and refresh tokens
  const accessToken = jwt.sign(
    {
      userId: foundUser.id,
      isAdmin: foundUser.isAdmin,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    {
      userId: foundUser.id,
      isAdmin: foundUser.isAdmin,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );
  // Store refresh token in user document
  foundUser.refreshToken = refreshToken;
  await foundUser.save();

  // Set refresh token as a cookie
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  // Send user data along with access token as a response
  res.status(200).json({
    name: foundUser.name,
    user: foundUser.email,
    roles: foundUser.isAdmin,
    token: accessToken,
    id: foundUser._id,
  });
});

// Refresh access token
const refreshTokenUser = asyncHandler(async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401);
  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden", err: err });

      const foundUser = await User.findById(decoded?.userId);

      if (!foundUser || foundUser.refreshToken !== refreshToken) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }

      const accessToken = jwt.sign(
        {
          userId: foundUser.id,
          isAdmin: foundUser.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      // Send user data along with new access token as a response
      res.status(200).json({
        name: foundUser.name,
        user: foundUser.email,
        roles: foundUser.isAdmin,
        token: accessToken,
        id: foundUser._id,
      });
    })
  );
});

// Logout user
const logoutUser = asyncHandler(async (req, res) => {
  // Clear the JWT cookie
  const authToken = req.headers.authorization;
  if (!authToken) return res.sendStatus(204);
  res.json({ message: "Cookie cleared" });
});

// Register a new user
const registerUser = asyncHandler(async (req, res) => {
  // Extract user details from request body
  const { name, email, password, phone } = req.body;

  // Check if all required fields are provided
  const requiredFields = [name, email, password, phone];
  if (requiredFields.some((field) => !field)) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields" });
  }
  // Check if password length is at least 6 characters
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }
  // Check if email already exists in the database
  const userExists = await User.findOne({ email });

  if (userExists) {
    // If email already exists, send a conflict response
    return res.status(409).json({ message: "Email already exists" });
  }
  // Create a new user instance
  let user = new User({
    name,
    email,
    password,
    phone,
  });
  // Save the new user to the database
  user = await user.save();
  if (!user) {
    // If user creation fails, send a not found response
    return res.status(404).send("The user cannot be created!");
  }
  // Generate a verification token and send verification email
  const token = new Token({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
    createdAt: Date.now(),
    expiresAt: Date.now() + 10800 * (60 * 1000), //7 days
  });
  await token.save();

  const verifyLink = `${process.env.FRONTEND_URL}/users/confirm/${token.token}`;
  const email_user = user.email;
  const name_user = user.name;

  try {
    await verifEmail(verifyLink, email_user, name_user);
    res.status(200).json({
      success: true,
      message: "Email send check your mail",
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent. please try agein");
  }
});

// Delete user
const deleteUser = asyncHandler(async (req, res) => {
  try {
    // Find and delete user by ID
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      // If user is deleted, send a success response
      return res
        .status(200)
        .json({ success: true, message: "The user is deleted!" });
    } else {
      // If user is not found, send a not found response
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
  } catch (err) {
    // If an error occurs, send a server error response
    return res.status(500).json({ success: false, error: err });
  }
});

// Edit user (for user)
const editUser = asyncHandler(async (req, res) => {
  // Find user by ID
  const userId = req.body._id;
  const user = await User.findById(userId);
  if (!user) {
    // If user not found, send a not found response
    return res.status(404).json({ message: "User not found" });
  }

  // Update user information
  user.name = req.body.name;
  user.email = req.body.email;
  user.phone = req.body.phone;
  user.street = req.body.street;
  user.apartment = req.body.apartment;
  user.zip = req.body.zip;
  user.city = req.body.city;
  user.country = req.body.country;

  await User.findByIdAndUpdate(userId, user, { new: true });
  // Send the updated user as a response
  res.status(200).json(user);
});

// Change user password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(404);
    throw new Error("User Not Found, Please Signup");
  }

  // Check if old password matches password in DB
  const passwordIsCorrect = await bcrypt.compareSync(
    oldpassword,
    user.password
  );

  // Save new password if the old password is correct
  if (passwordIsCorrect) {
    user.password = password;
    await user.save();
    // Send a success response
    res.status(200).json({ message: "Password change successful" });
  } else {
    // If old password is incorrect, send a bad request response
    res.status(400);
    throw new Error("Old password is incorrect!");
  }
});

// Forgot password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    // If user not found, send a not found response
    res.status(404);
    throw new Error("User does not exist!");
  }

  // Create reset token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  // Hash token before saving to DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save token to DB
  await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), //30 minutes
  }).save();

  // Construct reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  // Send reset email

  const email_user = user.email;
  const name_user = user.name;

  try {
    await sendEmail(resetUrl, name_user, email_user);
    // Send a success response
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent. please try again");
  }
});

// Reset password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;
  // Hash token, then compare to token in DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Find token in DB
  const userToken = await Token.findOne({
    token: hashedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    // If token not found or expired, send a not found response
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  // Find user
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  // Send a success response
  res.status(200).json({ message: "Password Reset Successful, Please Login" });
});

// Activate user account
const activateUser = asyncHandler(async (req, res) => {
  const token = req.params.token;

  try {
    const foundToken = await Token.findOne({
      token: token,
      expiresAt: { $gt: Date.now() },
    });
    if (!foundToken) {
      // If token not found, send a not found response
      return res.status(404).json({ success: false, error: "Token not found" });
    }

    await User.updateOne(
      { _id: foundToken.userId },
      { $set: { verified: true } }
    );
    await Token.findByIdAndDelete(foundToken._id);
    // Send a success response
    res.send("Email verified");
  } catch (err) {
    // If an error occurs, send a server error response
    res.status(500).json({ success: false, error: err });
  }
});

// Get user count
const countUser = asyncHandler(async (req, res) => {
  try {
    // Count the total number of users
    const userCount = await User.countDocuments();

    if (!userCount) {
      // If user count is zero, send a server error response
      return res.status(500).json({ success: false });
    }

    // Send the user count as a response
    res.send({ userCount: userCount });
  } catch (err) {
    // If an error occurs, send a server error response
    res.status(500).json({ success: false, error: err });
  }
});

module.exports = {
  getallUsers,
  getuser,
  createUser,
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
};
