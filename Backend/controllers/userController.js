const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModle");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const message = require("../utils/messageEmail");

const generatToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Register User
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }
  if (password.length < 6) { 
    res.status(400);
    throw new Error("Password must be up to 6 characters");
  }

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409);
    throw new Error("You cannot use this email");
  }

  //Create new user
  const user = await User.create({
    name,
    email,
    password,
  });

  // Generate Token
  const token = generatToken(user._id);

  // Send Http
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    smaeSite: "none",
    secure: true,
  });

  if (user) {
    const {email ,token } = user;
    res.status(201).json({
      email,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// Login User
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please add email and password!");
  }
  //check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401);
    throw new Error("User not found!, pleases singup");
  }

  //Check if password is correct
  const passewordIsCorrect = await bcrypt.compare(password, user.password);

  // Generate Token
  const token = generatToken(user._id);

  // Send Http
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400), // 1 day
    smaeSite: "none",
    secure: true,
  });

  if (user && passewordIsCorrect) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      email,
      token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password!");
  }
});
//Logout user

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    smaeSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "Successfully Logged Out" });
});
//Get User Data
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { _id, name, email, photo, phone, bio } = user;
    res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
    });
  } else {
    res.status(400);
    throw new Error("User Not Found!");
  }
});

//Get Login Status
const loggedinStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json(false);
  }
  const verifed = jwt.verify(token, process.env.JWT_SECRET);
  if (verifed) {
    return res.json(true);
  }
  return res.json(false);
});
//Update User
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { name, email, photo, phone, bio } = user;
    (user.email = email), (user.name = req.body.name || name);
    user.phone = req.body.phone || phone;
    user.bio = req.body.bio || bio;
    user.photo = req.body.photo || photo;

    const updateUser = await user.save();
    res.status(200).json({
      _id: updateUser._id,
      name: updateUser.name,
      email: updateUser.email,
      photo: updateUser.photo,
      phone: updateUser.phone,
      bio: updateUser.bio,
    });
  } else {
    res.status(404);
    throw new Error("User Ont Fuond");
  }
});
//Change Password
const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
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
    res.status(200).send("Password change successful");
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
  //Delete token if it exists in DB
  let token = await Token.findOne({ userId: user._id });
  if (token) {
    await token.deleteOne();
  }
  //Creat Rest Token
  let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
  console.log(resetToken);

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
  const message = message;
  const subject = "طلب إعادة تعيين كلمة المرور";
  const send_to = user.email;
  const sent_from = process.env.EMAIL_USER;

  try {
    await sendEmail(subject, message, send_to, sent_from);
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

module.exports = {
  registerUser,
  loginUser,
  logout,
  getUser,
  loggedinStatus,
  updateUser,
  changePassword,
  forgotPassword,
  resetPassword,
};
