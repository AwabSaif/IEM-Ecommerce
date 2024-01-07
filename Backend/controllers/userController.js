const asyncHandler = require("express-async-handler");
const { User } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { sendEmail, verifEmail } = require("../utils/sendEmail");
const Token = require("../models/tokenModle");
const { token } = require("morgan");

const secret = process.env.JWT_SECRET;
//get all Users
const getallUsers = asyncHandler(async (req, res) => {
  const userList = await User.find().select("name email phone");

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
    res.status(400).json({ message: "Please add email and password!" });
  }
  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ message: "User not found!, pleases singup" });
  }
  //Check if password is correct
  const passewordIsCorrect = await bcrypt.compareSync(password, user.password);
  if (user && passewordIsCorrect) {
    const token = jwt.sign(
      {
        userId: user.id,
        isAdmin: user.isAdmin,
      },
      secret,
      { expiresIn: "1d" }
    );
    res.status(200).json({ user: user.email, token: token });
  } else {
    res.status(400).send("Invalid email or password!");
  }
});

// register user
const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    phone,
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
  const token = new Token({
    userId: user._id,
    token: crypto.randomBytes(32).toString("hex"),
    createdAt: Date.now(),
    expiresAt: Date.now() + 10800 * (60 * 1000), //7 days
  });
  await token.save();
  console.log(token);
  const verifyLink = `${process.env.FRONTEND_URL}/users/confirm/${token.token}`;

  const message = `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Account Verification</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        text-align: center;
      }
      h1 {
        color: #333;
      }
      h2 {
        color: #007BFF;
      }
      p {
        color: #555;
        margin-bottom: 20px;
      }
      a {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007BFF;
        color: #fff;
        text-decoration: none;
        border-radius: 3px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <h1>Welcome to IEM ECOMMERCE</h1>
      <h2>Hello,</h2>
      <p>We're excited to have you on board! Before you get started, we just need you to verify your account.</p>
      <p>To verify your account, click on the link below:</p>
      <a href="${verifyLink}">Verify Your Account</a>
      <p>If you didn't create an account, you can safely ignore this email.</p>
      <p>Thank you for choosing IEM ECOMMERCE!</p>
    </div>
  </body>
  </html>`;
  const subject = "Account Verification";
  const send_to = user.email;

  const sent_from = process.env.EMAIL_USER;
  try {
    await sendEmail(subject, message, send_to, sent_from);
    res.status(200).json({
      success: true,
      message: "Email send check your ma",
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      street: req.body.street,
      apartment: req.body.apartment,
      zip: req.body.zip,
      city: req.body.city,
      country: req.body.country,
    });
  } catch (error) {
    res.status(500);
    throw new Error("Email not sent. please try agein");
  }
  /* 
  res.json({
    name:   req.body.name,
    email: req.body.email,
    phone:   req.body.phone,
    street:   req.body.street,
    apartment:   req.body.apartment,
    zip:   req.body.zip,
    city:   req.body.city,
    country:   req.body.country,
  }); */
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
  const message = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f4f4;
            text-align: center;
            margin: 0;
            padding: 20px;
        }
  
        h1 {
            color: #333;
        }
  
        h2 {
            color: #007bff;
        }
  
        p {
            color: #555;
            font-size: 16px;
        }
  
        a {
            display: inline-block;
            margin-top: 10px;
            padding: 10px 20px;
            background-color: #007bff;
            color: #fff;
            text-decoration: none;
            border-radius: 5px;
            transition: background-color 0.3s;
        }
  
        a:hover {
            background-color: #0056b3;
        }
    </style>
  </head>
  
  <body>
    <h1>Password Reset</h1>
    <h2>Hello ${user.name},</h2>
  
    <p>We received a request to reset your password for your account at IEM ECOMMERCE.</p>
  
    <p>To reset your password, click on the link below.</p>
  
    <a href="${resetUrl}">Reset Password</a>
  
    <p>If you did not request a password reset, you can ignore this email.</p>
  
    <p>Thank you for using IEM ECOMMERCE.</p>
  </body>
  
  </html>`;

  const subject = "Password reset request";
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
//active account
const activetUser = asyncHandler(async (req, res) => {
  
  const token = req.params.tToken 
  
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
};
