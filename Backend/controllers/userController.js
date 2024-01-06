const asyncHandler = require("express-async-handler");
const { User } = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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
   const passewordIsCorrect = await bcrypt.compare(password, user.password);
  if (user && passewordIsCorrect) {
    const token = jwt.sign(
      {
          userId: user.id,
          isAdmin: user.isAdmin
      },
      secret,
      {expiresIn : '1d'}
  )
    res.status(200).json({user: user.email, token: token})
  } else {
    res.status(400).send("Invalid email or password!");
  }
 
});

module.exports = {
  getallUsers,
  getuser,
  createUser,
  loginUser,
};
