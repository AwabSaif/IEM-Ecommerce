const asyncHandler = require("express-async-handler");
const { User } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendEmail, verifEmail } = require("../utils/emailService");
const Token = require("../models/tokenModle");

//get all Users
const getallUsers = asyncHandler(async (req, res) => {
  const userList = await User.find().select("name email phone createdAt");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(userList);
});

//get user
const getuser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res
      .status(500)
      .json({ message: "The user with the given ID was not found." });
  }
  res.status(200).send(user);
});

//create user
const createUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
    isAdmin,
    street,
    apartment,
    zip,
    city,
    country,
  } = req.body;
  if (!name || !email || !password || !phone) {
    res.status(400).json({ message: "Please fill in all required fields" });
  }
  if (password.length < 6) {
    res.status(400).json({ message: "Password must be up to 6 characters" });
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409).json({ message: "Email already exists" });
  }
  let user = new User({
    name,
    email,
    password,
    phone,
    isAdmin,
    street,
    apartment,
    zip,
    city,
    country,
  });
  user = await user.save();
  if (!user) {
    return res.status(404).send("The user cannot be created!");
  }
  res.send(user);
});

// Update User for admin
const updateUser = asyncHandler(async (req, res) => {
  const userExist = await User.findById(req.params.id);
  let newPassword;
  if (req.body.password) {
    newPassword = bcrypt.hashSync(req.body.password, 10);
  } else {
    newPassword = userExist.passwordHash;
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      passwordHash: newPassword,
      phone: req.body.phone,
      isAdmin: req.body.isAdmin,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    },
    { new: true }
  );

  if (!user) return res.status(400).send("the user cannot be updated!");

  res.send(user);
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password." });
  }

  // Find user by email
  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Check if user is verified
  if (!foundUser.verified) {
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
    return res.status(400).json({ message: "Invalid email or password." });

  // Generate JWT token
  const token = jwt.sign(
    {
      userId: foundUser.id, // اعتمد على معرف المستخدم في التوقيع
      isAdmin: foundUser.isAdmin,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "3d" }
  );

  res
    .status(200)
    .json({ user: foundUser.email, roles: foundUser.isAdmin, token: token });
});

//refresh Token User

const refreshTokenUser = asyncHandler(async (req, res) => {
  const refreshToken = req.headers.authorization;
  const cleanedToken = refreshToken.replace("Bearer ", "");

  jwt.verify(
    cleanedToken,
    process.env.ACCESS_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden", err: err });
      const foundUser = await User.findOne({ user: decoded.email });

      const token = jwt.sign(
        {
          userId: foundUser.id,
          isAdmin: foundUser.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "3d" }
      );

      res.status(200).json({
        user: foundUser.email,
        roles: foundUser.isAdmin,
        token: token,
      });
    })
  );
});

//logout User
const logoutUser = asyncHandler(async (req, res) => {
  const authToken = req.headers.authorization;
  if (!authToken) return res.sendStatus(204);
  res.json({ message: "Cookie cleared" });
});
// register user
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const requiredFields = [name, email, password, phone];
  if (requiredFields.some((field) => !field)) {
    return res
      .status(400)
      .json({ message: "Please fill in all required fields" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }
  const userExists = await User.findOne({ email });

  if (userExists) {
    return res.status(409).json({ message: "Email already exists" });
  }
  let user = new User({
    name,
    email,
    password,
    phone,
  });
  user = await user.save();
  if (!user) {
    return res.status(404).send("The user cannot be created!");
  }
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

//delete User
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (user) {
      return res
        .status(200)
        .json({ success: true, message: "The user is deleted!" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err });
  }
});

// Edit User for user
const editUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id).select(
    "name email phone street apartment zip city country"
  );

  if (user) {
    await user.save();
    res.status(200).json({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
  } else {
    res.status(400).json({ message: "the user cannot be updated" });
  }
});

//Change Password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.body._id);
  const { oldPassword, password } = req.body;

  if (!user) {
    res.status(404);
    throw new Error("User Ont Fuond, Please Signup");
  }
  // Valdidate
  if (!oldPassword || !password) {
    res.status(404);
    throw new Error("Please old and new password");
  }
  // Check if  old password matches password in BD
  const passewordIsCorrect = await bcrypt.compare(oldPassword, user.password);

  //Save new password
  if (user && passewordIsCorrect) {
    user.password = password;
    await user.save();
    res.status(200).json({ message: "Password change successful" });
  } else {
    res.status(400);
    throw new Error("Old password is incorrect!");
  }
});

//Forgot Password
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error("User does not exist!");
  }

  //Creat Rest Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;

  //Hass token before saving to  DB
  const hasedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Save token to DB
  await new Token({
    userId: user._id,
    token: hasedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000), //30 minutes
  }).save();

  //Construct Rest Url
  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
  //Reset Email

  const email_user = user.email;
  const name_user = user.name;

  try {
    await sendEmail(resetUrl, name_user, email_user);
    res.status(200).json({ success: true, message: "Reset Email Sent" });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent. please try agein");
  }
});

//Reset Password
const resetPassword = asyncHandler(async (req, res) => {
  const { password } = req.body;
  const { resetToken } = req.params;
  //hash token, then copare to token in db
  const hasedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //find token in db
  const userToken = await Token.findOne({
    token: hasedToken,
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  //Find user
  const user = await User.findOne({ _id: userToken.userId });
  user.password = password;
  await user.save();
  res.status(200).json({ message: "Password Reset Successful, Please Login" });
});
//active account
const activetUser = asyncHandler(async (req, res) => {
  const token = req.params.token;

  try {
    const foundToken = await Token.findOne({
      token: token,
      expiresAt: { $gt: Date.now() },
    });
    if (!foundToken) {
      return res.status(404).json({ success: false, error: "Token not found" });
    }

    await User.updateOne(
      { _id: foundToken.userId },
      { $set: { verified: true } }
    );
    await Token.findByIdAndDelete(foundToken._id);
    res.send("email verified");
  } catch (err) {
    res.status(500).json({ success: false, error: err });
  }
});

//User count
const countUser = asyncHandler(async (req, res) => {
  try {
    const userCount = await User.countDocuments();

    if (!userCount) {
      return res.status(500).json({ success: false });
    }

    res.send({ userCount: userCount });
  } catch (err) {
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
  activetUser,
  countUser,
  refreshTokenUser,
  logoutUser,
};
