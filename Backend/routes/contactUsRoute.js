const asyncHandler = require("express-async-handler");
const express = require("express");
const contactUsEmail = require("../utils/contactUsEmail");

// Create a router instance
const router = express.Router();

// Define a route for handling POST requests to the /iem-contact-us endpoint
router.post(
  "/",
  // Async handler middleware to handle asynchronous operations
  asyncHandler(async (req, res) => {
    // Extract data from the request body
    const { name, email, subject, message } = req.body;
    try {
      // Call the function to send the contact us email
      await contactUsEmail(name, email, subject, message);
      // Send a success response if the email is sent successfully
      res.status(200).json({
        success: true,
        message: "Email sent",
      });
    } catch (error) {
      // If there's an error, send a server error response
      res.status(500).json({
        success: false,
        message: "Email not sent. Please try again.",
      });
    }
  })
);

// Export the router instance for use in other files
module.exports = router;
