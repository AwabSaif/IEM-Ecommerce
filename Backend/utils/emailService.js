const nodemailer = require("nodemailer");

const sendEmail = async (resetUrl, name_user, email_user) => {
  //Create Email Transporter
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    //Option for sending email
    const potions = {
      from: process.env.EMAIL_USER,
      to: email_user,
      replyTo: process.env.EMAIL_USER,
      subject: "Password reset",
      html: `
    <!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Password Reset</title>
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
          a:hover {
              background-color: #0056b3;
          }
      </style>
    </head>
    
    <body>
      <h1>Password Reset</h1>
      <h2>Hello ${name_user},</h2>
    
      <p>We received a request to reset your password for your account at IEM ECOMMERCE.</p>
    
      <p>To reset your password, click on the link below.</p>
    
      <a href="${resetUrl}">Reset Password</a>
    
      <p>If you did not request a password reset, you can ignore this email.</p>
    
      <p>Thank you for using IEM ECOMMERCE.</p>
    </body>
    
    </html>`,
    };
    //send email
    const info = await transporter.sendMail(potions);
    
  } catch (err) {
    console.error("Email failed to send", err);
  }
};

const verifEmail = async (verifyLink, email_user, name_user) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Options for sending email
    const options = {
      from: process.env.EMAIL_USER,
      to: email_user,
      replyTo: process.env.EMAIL_USER,
      subject: "Account Verification",
      html: `<!DOCTYPE html>
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
          <h2>Hello ${name_user},</h2>
          <p>We're excited to have you on board! Before you get started, we just need you to verify your account.</p>
          <p>To verify your account, click on the link below:</p>
          <a href="${verifyLink}">Verify Your Account</a>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>Thank you for choosing IEM ECOMMERCE!</p>
        </div>
      </body>
      </html>`,
    };
    const info = await transporter.sendMail(options);
  
  } catch (err) {
    console.error("Email failed to send", err);
  }
};

module.exports = { sendEmail, verifEmail };
