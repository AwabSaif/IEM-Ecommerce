const asyncHandler = require("express-async-handler");
const express = require("express");
const contactUsEmail = require("../utils/contactUsEmail");
const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, subject, message } = req.body;
    try {
      await contactUsEmail(name, email, subject, message);
      res.status(200).json({
        success: true,
        message: "Email send",
      });
    } catch (error) {
      res.status(500);
      throw new Error("Email not sent. please try agein");
    }
  })
);
module.exports = router;
