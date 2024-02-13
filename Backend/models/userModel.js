const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the schema for the User model
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"],
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true,
    trim: true,
    match: [
      // Regular expression to validate email format
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
    required: [true, "Please add a password"],
    minLength: [6, "Password must be at least 6 characters long"],
  },
  phone: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  street: {
    type: String,
    default: "",
  },
  apartment: {
    type: String,
    default: "",
  },
  zip: {
    type: String,
    default: "",
  },
  city: {
    type: String,
    default: "",
  },
  country: {
    type: String,
    default: "",
  },
  refreshToken: {
    type: String,
  },
},
{
  timestamps: true, // Automatically add timestamps for createdAt and updatedAt
});

// Middleware to hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next(); // If password is not modified, move to the next middleware
  }
  try {
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10); // Generate a salt with cost factor 10
    const hashedPassword = await bcrypt.hash(this.password, salt); // Hash the password with the generated salt
    this.password = hashedPassword; // Set the hashed password to the user's password field
    next(); // Move to the next middleware
  } catch (error) {
    return next(error); // Pass any error to the next middleware
  }
});

// Define a virtual property 'id' for the user schema
userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

// Convert the virtuals to JSON format when the schema is transformed to JSON
userSchema.set("toJSON", {
  virtuals: true,
});

// Create and export the User model based on the schema
exports.User = mongoose.model("User", userSchema);

// Export the userSchema for use in other files
exports.userSchema = userSchema;
