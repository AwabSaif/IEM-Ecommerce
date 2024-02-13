const mongoose = require("mongoose");

// Define the schema for the Token model
const tokenSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    required: true, // User ID is required
    ref: "user", // Name of the referenced model
  },
  token: {
    type: String,
    required: true, // Token string is required
  },
  createdAt: {
    type: Date,
    required: true, // Creation date is required
  },
  expiresAt: {
    type: Date,
    required: true, // Expiration date is required
  },
});

// Create the Token model based on the schema
const Token = mongoose.model("Token", tokenSchema);

// Export the Token model
module.exports = Token;
