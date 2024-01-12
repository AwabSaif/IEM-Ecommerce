const nodemailer = require("nodemailer");

const contactUsEmail = async (name, email, subject, message) => {
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
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER,
      subject: `${subject} from ${email}`,
      html: `
      <!DOCTYPE html>
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
            text-align: lift;
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
         
        </style>
      </head>
      <body>
        <div class="container">
      <h2>You got a message from</h2>
     <h3>Name: ${name} </h3>
     <p>Email : ${email}</p>
     <p> Message: ${message}</p>
     </div>
      </body>
      </html>`,
    };

    const info = await transporter.sendMail(mailOptions);
  } catch (err) {
    console.error("Email failed to send", err);
  }
};

module.exports = contactUsEmail;
