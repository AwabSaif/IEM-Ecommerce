const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Token = require("../models/tokenModle");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");




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
    const { _id, name, email, photo, phone, bio } = user;
    res.status(201).json({
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
  const message = `<!DOCTYPE HTML
 
  <html"
    xmlns:o="urn:schemas-microsoft-com:office:office">
  
  <head>
  
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="x-apple-disable-message-reformatting">
    
    <meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
    <title>استعادة كلمة المرور</title>
  
    <style type="text/css">
      @media only screen and (min-width: 620px) {
        .u-row {
          width: 600px !important;
        }
  
        .u-row .u-col {
          vertical-align: top;
        }
  
        .u-row .u-col-50 {
          width: 300px !important;
        }
  
        .u-row .u-col-100 {
          width: 600px !important;
        }
  
      }
  
      @media (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
  
        .u-row .u-col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
  
        .u-row {
          width: 100% !important;
        }
  
        .u-col {
          width: 100% !important;
        }
  
        .u-col>div {
          margin: 0 auto;
        }
      }
  
      body {
        margin: 0;
        padding: 0;
      }
  
      table,
      tr,
      td {
        vertical-align: top;
        border-collapse: collapse;
      }
  
      p {
        margin: 0;
      }
  
      .ie-container table,
      .mso-container table {
        table-layout: fixed;
      }
  
      * {
        line-height: inherit;
      }
  
      a[x-apple-data-detectors='true'] {
        color: inherit !important;
        text-decoration: none !important;
      }
  
      table,
      td {
        color: #0e67b4;
      }
  
      #u_body a {
        color: 0e67b4;
        text-decoration: underline;
      }
    </style>
  
  
  
  
    <link href="https://fonts.googleapis.com/css2?family=Anton&display=swap" rel="stylesheet" type="text/css">
    <link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css">
  
  
  </head>
  
  <body class="clean-body u_body"
    style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: 0e67b4">
  
    <table id="u_body"
      style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%"
      cellpadding="0" cellspacing="0">
      <tbody>
        <tr style="vertical-align: top">
          <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
            
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: #f9f9f9">
              <div class="u-row"
                style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                  
                  <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                          width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;"
                                align="left">
  
                                <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                                  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #f9f9f9;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                  <tbody>
                                    <tr style="vertical-align: top">
                                      <td
                                        style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <span>&#160;</span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div><!--<![endif]-->
                    </div>
                  </div>
                 
                </div>
              </div>
            </div>
  
  
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row"
                style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                 
                  <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                          width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:25px 10px;font-family:'Lato',sans-serif;"
                                align="left">
  
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
  
                                      <img align="center" border="0" src="images/image-2.jpeg" alt="Image" title="Image"
                                        style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 0%;max-width: 0px;" />
  
                                    </td>
                                  </tr>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                       
                      </div>
                    
                    </div>
                  </div>
  
                </div>
              </div>
            </div>
  
  
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row"
                style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0e67b4;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
  
                  <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                          width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:35px 10px 10px;font-family:'Lato',sans-serif;"
                                align="left">
  
                                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                  <tr>
                                    <td style="padding-right: 0px;padding-left: 0px;" align="center">
  
                                    </td>
                                  </tr>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                          width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:0px 10px 30px;font-family:'Lato',sans-serif;"
                                align="left">
  
                                <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 140%; text-align: center;"><span
                                      style="font-size: 18px; line-height: 25.2px; color: #ecf0f1;"><strong>الرجاء استخدام
                                        عنوان الرابط أدناه لإعادة تعيين كلمة المرور الخاصة بك</strong></span></p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                      </div>=
                    </div>
                  </div>
  
                </div>
              </div>
            </div>
  
  
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row"
                style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                 
                  <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                          width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;"
                                align="left">
  
                                <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                  <p style="line-height: 140%; text-align: right;">${user.name} مرحبًا </p>
                                  <p style="line-height: 140%; text-align: right;"> </p>
                                  <p style="line-height: 140%; text-align: right;"> لقد أرسلنا إليك هذا البريد  الإلكتروني ردًا على طلبك لإعادة تعيين كلمة المرور الخاصة بك على IEM </p>
                                  <p style="line-height: 140%; text-align: right;"> </p>
                                  <p style="line-height: 140%; text-align: right;"><br />لإعادة تعيين كلمة المرور الخاصة
                                    بك، يرجى اتباع الرابط أدناه</p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                          width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:0px 40px;font-family:'Lato',sans-serif;"
                                align="left">
  
                                <div align="left">
                                  
                                  <a href=${resetUrl} target="_blank" class="v-button"
                                    style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #0e67b4; border-radius: 1px;-webkit-border-radius: 1px; -moz-border-radius: 1px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
                                    <span style="display:block;padding:15px 40px;line-height:120%;"><span
                                        style="font-family: Anton; line-height: 19.2px; font-size: 16px;"><strong>إعادة
                                          تعيين كلمة المرور</strong></span></span>
                                  </a>
                                
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                          width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;"
                                align="left">
  
                                <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                  <p style="font-size: 14px; line-height: 140%; text-align: right;"><span
                                      style="font-size: 16px; line-height: 22.4px;">يرجى تجاهل هذا البريد الإلكتروني إذا
                                      لم تطلب تغيير كلمة المرور.</span></p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                 
                      </div><!--<![endif]-->
                    </div>
                  </div>
                 
                </div>
              </div>
            </div>
  
  
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row"
                style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color:#0e67b4;">
                
                  <div class="u-col u-col-50"
                    style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="box-sizing: border-box; height: 100%; padding: 20px 20px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
          width="100%" >
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;"
                                align="left">
  
                                <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                  <p style="line-height: 140%; font-size: 14px;"><span
                                      style="font-size: 14px; line-height: 19.6px;"><span
                                        style="color: #ecf0f1; font-size: 14px; line-height: 19.6px;">IEM ©  All Rights
                                        Reserved</span></span></p>
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div><!--<![endif]-->
                    </div>
                  </div>
                 
                  <div class="u-col u-col-50"
                    style="max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
            
                      <div
                        style="box-sizing: border-box; height: 100%; padding: 0px 0px 0px 20px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
  
             
                      </div><!--<![endif]-->
                    </div>
                  </div>
                
                </div>
              </div>
            </div>
  
  
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: #f9f9f9">
              <div class="u-row"
                style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #0e67b4;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
              
                  <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                      <!--[if (!mso)&(!IE)]><!-->
                      <div
                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                        <!--<![endif]-->
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                          width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;"
                                align="left">
  
                                <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%"
                                  style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid hsl(0, 0%, 100%);-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                  <tbody>
                                    <tr style="vertical-align: top">
                                      <td
                                        style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                        <span>&#160;</span>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                        <!--[if (!mso)&(!IE)]><!-->
                      </div><!--<![endif]-->
                    </div>
                  </div>
                  <!--[if (mso)|(IE)]></td><![endif]-->
                  <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                </div>
              </div>
            </div>
  
  
  
  
  
            <div class="u-row-container" style="padding: 0px;background-color: transparent">
              <div class="u-row"
                style="margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;">
                <div
                  style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                 
                  <div class="u-col u-col-100"
                    style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
                    <div style="height: 100%;width: 100% !important;">
                 <div
                        style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                   
  
                        <table style="font-family:'Lato',sans-serif;" role="presentation" cellpadding="0" cellspacing="0"
                          width="100%" border="0">
                          <tbody>
                            <tr>
                              <td
                                style="overflow-wrap:break-word;word-break:break-word;padding:0px 40px 30px 20px;font-family:'Lato',sans-serif;"
                                align="left">
  
                                <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
  
                                </div>
  
                              </td>
                            </tr>
                          </tbody>
                        </table>
  
                      </div><!--<![endif]-->
                    </div>
                  </div>
  
                </div>
              </div>
            </div>
  
  
  
          </td>
        </tr>
      </tbody>
    </table>
  
  </body>
  
  </html>` ;

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
 
  const {password}= req.body;
  const {resetToken}= req.params;
  //hash token, then copare to token in db
  const hasedToken = crypto
  .createHash("sha256")
  .update(resetToken)
  .digest("hex");

  //find token in db 
  const userToken = await Token.findOne({
    token: hasedToken,
    expiresAt: {$gt: Date.now()}
  })

  if (!userToken) {
    res.status(404);
    throw new Error("Invalid or Expired Token");
  }

  //Find user 
  const user = await User.findOne({_id: userToken.userId})
  user.password = password;
  await user.save()
  res.status(200).json({message: "Password Reset Successful, Please Login"})

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
