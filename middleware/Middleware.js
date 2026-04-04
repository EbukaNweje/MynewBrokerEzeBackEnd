const emailSender = require("../utilities/emailSender");
const transporter = require("../utilities/email");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const createError = require("../utilities/error");

// exports.isLogin = async(req, res, next) => {
//    const user = await User.findOne({email: req.body.email})
//    if(!user){
//        return next(createError(400, "User not found"))
//    }

//    if(user.token){
//         const subject = "New Device Login Notification";
//         const isLoginMsg = `
//         <!DOCTYPE html>
//         <html lang="en">
//         <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Document</title>
//         <style>
//             body {
//                 margin: 0;
//                 padding: 0;
//                 font-family: Arial, Helvetica, sans-serif;
//                 background-color: whitesmoke;
//             }
//             .container {
//                 width: 100%;
//                 background-color: whitesmoke;
//                 padding: 0;
//                 margin: 0;
//             }
//             .header, .footer {
//                 width: 100%;
//                 background-color: #21007F;
//                 color: white;
//                 text-align: center;
//             }
//             .content {
//                 width: 100%;
//                 max-width: 600px;
//                 background-color: white;
//                 padding: 20px;
//                 margin: 20px auto;
//                 box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
//             }
//             .footer-content {
//                 padding: 20px;
//                 text-align: center;
//             }
//             .contact-info, .social-icons {
//                 display: inline-block;
//                 vertical-align: top;
//                 width: 48%;
//                 margin-bottom: 20px;
//             }
//             .social-icons img {
//                 width: 30px;
//                 margin: 0 5px;
//             }
//             .footer-logo img {
//                 width: 50px;
//             }
//             .footer-logo, .footer-info {
//                 text-align: center;
//                 margin-bottom: 20px;
//             }
//             .footer p {
//                 margin: 5px 0;
//             }
//         </style>
//         </head>
//         <body>
//             <div class="container">
//                 <div class="header">
//                     <table width="100%" cellspacing="0" cellpadding="0">
//                         <tr>
//                             <td style="padding: 20px 0;">
//                                 <h1 style="color: #ffffff; font-size: 40px; font-family: Impact, sans-serif; font-weight: 500">Asset Development</h1>
//                             </td>
//                         </tr>
//                     </table>
//                 </div>

//                 <div class="content">
//                     <p>Hi ${user.fullName},</p>
//                     <p>Someone is trying to login to your account. plase if it is you, ignore this message. If not, please click the link below to reset your password. {Link}</p>
//                     <p>For more enquiries, kindly contact your account manager or use our live chat support on our platform. You can also send a direct mail to us at <span style="color: #4c7fff;">${process.env.USEREMAIL}</span></p>
//                     <p>Thank you for choosing our platform. We look forward to serving you.</p>
//                 </div>

//                 <div class="footer">
//                     <div class="footer-content">
//                         <div class="https://i.ibb.co/Gcs5Lbx/jjjjjjjjjj.jpg">
//                             <img src="footer-logo.png" alt="">
//                         </div>
//                         <div class="footer-info">
//                             <p>We bring the years, global experience, and stamina to guide our clients through new and often disruptive realities.</p>
//                             <p>© Copyright 2024 Asset Development. All Rights Reserved.</p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </body>
//         </html>

//             `

//         const notificationEmailSend = emailSender(user.email, subject, isLoginMsg);
//             transporter.sendMail(notificationEmailSend, (error, info) => {
//                 if (error) {
//                     console.error("Error sending email:", error);
//                 } else {
//                     console.log("Email sent successfully:", info.response);
//                 }
//             })
//         return res.status(403).send('You are already logged in on another device');
//    }

//    next()
// }

exports.isLogin = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send("User not found");
  }

  const token = jwt.sign(
    { id: user._id, isLogin: user.isLogin },
    process.env.JWT,
  );
  user.token = token;
  await user.save();

  jwt.verify(user.token, process.env.JWT, (err, decoded) => {
    if (err) {
      return next(createError(400, "Invalid token"));
    }
    if (decoded.isLogin === true) {
      const subject = "New Device Login Notification";
      const isLoginMsg = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: Arial, Helvetica, sans-serif;
                background-color: whitesmoke;
            }
            .container {
                width: 100%;
                background-color: whitesmoke;
                padding: 0;
                margin: 0;
            }
            .header, .footer {
                width: 100%;
                background-color: #21007F;
                color: white;
                text-align: center;
            }
            .content {
                width: 100%;
                max-width: 600px;
                background-color: white;
                padding: 20px;
                margin: 20px auto;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .footer-content {
                padding: 20px;
                text-align: center;
            }
            .contact-info, .social-icons {
                display: inline-block;
                vertical-align: top;
                width: 48%;
                margin-bottom: 20px;
            }
            .social-icons img {
                width: 30px;
                margin: 0 5px;
            }
            .footer-logo img {
                width: 50px;
            }
            .footer-logo, .footer-info {
                text-align: center;
                margin-bottom: 20px;
            }
            .footer p {
                margin: 5px 0;
            }
        </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <table width="100%" cellspacing="0" cellpadding="0">
                        <tr>
                            <td style="padding: 20px 0;">
                                <h1 style="color: #ffffff; font-size: 40px; font-family: Impact, sans-serif; font-weight: 500">Asset Development</h1>
                            </td>
                        </tr>
                    </table>
                </div>

                <div class="content">
                    <p>Hi ${user.fullName},</p>
                    <p>Someone is trying to login to your account. plase if it is you, ignore this message. If not, please click the link below to reset your password. {Link}</p>
                    <p>For more enquiries, kindly contact your account manager or use our live chat support on our platform. You can also send a direct mail to us at <span style="color: #4c7fff;">${process.env.USEREMAIL}</span></p>
                    <p>Thank you for choosing our platform. We look forward to serving you.</p>
                </div>

                <div class="footer">
                    <div class="footer-content">
                        <div class="https://i.ibb.co/Gcs5Lbx/jjjjjjjjjj.jpg">
                            <img src="footer-logo.png" alt="">
                        </div>
                        <div class="footer-info">
                            <p>We bring the years, global experience, and stamina to guide our clients through new and often disruptive realities.</p>
                            <p>© Copyright 2024 Asset Development. All Rights Reserved.</p>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>

            `;

      const notificationEmailSend = emailSender(
        user.email,
        subject,
        isLoginMsg,
      );
      transporter.sendMail(notificationEmailSend, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      });
      return res
        .status(403)
        .send("You are already logged in on another device");
    }

    next();
  });
};

exports.SuperAdminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT);
    if (!decoded.super) {
      return res
        .status(403)
        .json({ message: "Access denied. Not a super admin." });
    }
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};
