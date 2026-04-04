const Contact = require("../models/Contacts");
const sendEmail = require("../utilities/email");
// const transporter = require("../utilities/email");

exports.CreateContact = async (req, res, next) => {
  try {
    const data = req.body;
    const NewContactMsg = await Contact.create(data);

    if (!req.body) {
      return next(createError(400, "Fill all information!"));
    }
    // const sender =  NewContactMsg.email
    // console.log(sender)

    const mailOptions = {
      /*   let sender = NewContactMsg.email, */
      from: process.env.USER,
      to: process.env.USER,
      subject: "Support Form",
      html: `
          <h4>Hi Admin!</h4>
            <p>${NewContactMsg.fullName} Just sent you a Support message</p>

            <p> support department: ${NewContactMsg.supportDepartment} </p>
           <p>
                <b>${NewContactMsg.msg}</b>
           </p>

           <p>Quickly send him an Email.</p> 
            `,
    };

    // transporter.sendMail(mailOptions, (err, info) => {
    //   if (err) {
    //     console.log("erro", err.message);
    //   } else {
    //     console.log("Email has been sent to your inbox", info.response);
    //   }
    // });
    sendEmail(mailOptions);

    res.status(201).json({
      message: "message sent Successful",
      data: NewContactMsg,
    });
  } catch (err) {
    next(err);
  }
};

exports.AdminSendEmail = async (req, res, next) => {
  try {
    const id = req.params.id;
    const msg = req.body.msg;
    const subject = req.body.subject;
    const UserEmail = await User.findById(id);
    if (!UserEmail) {
      return res.status(400).json({
        message: "User does not exist",
      });
    }
    const email = UserEmail.email;
    console.log(email);
    const mailOptions = {
      from: process.env.USERE,
      to: email,
      subject: subject,
      html: `
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
                              <td style="padding: 10px;">
                                  <div class="contact-info">
                                      <p><img src="https://i.ibb.co/K04zq8b/WCall.png" alt="" style="width: 20px;"> +1 (302) 786‑5689</p>
                                      <p><img src="https://i.ibb.co/TL7k4FF/Container.png" alt="" style="width: 20px;"> unixswaptradecu@gmail.com</p>
                                      <p><img src="https://i.ibb.co/CbSFkwC/Wloc.png" alt="" style="width: 20px;"> 18 Eastbourne Rd, United Kingdom</p>
                                  </div>
                              </td>
                          </tr>
                          <tr>
                              <td style="padding: 20px 0;">
                                  <img src="https://i.ibb.co/Gcs5Lbx/jjjjjjjjjj.jpg" alt="">
                                  <h1 style="color: #ffffff; font-size: 40px; font-family: Impact, sans-serif; font-weight: 500">Swifteatrn Prime</h1>
                              </td>
                          </tr>
                      </table>
                  </div>
          
                  <div class="content">
                      <p>Hi ${UserEmail.fullName},</p>
                      <p> ${msg} </p>
                      <p>For more enquiries, kindly contact your account manager or use our live chat support on our platform. You can also send a direct mail to us at <span style="color: #4c7fff;">${process.env.USERE}</span></p>
                      <p>Thank you for choosing our platform. We wish you successful trading.</p>
                  </div>
          
                  <div class="footer">
                      <div class="footer-content">
                          <div class="https://i.ibb.co/Gcs5Lbx/jjjjjjjjjj.jpg">
                              <img src="footer-logo.png" alt="">
                          </div>
                          <div class="footer-info">
                              <p>We bring the years, global experience, and stamina to guide our clients through new and often disruptive realities.</p>
                              <p>© Copyright 2024 Swifteatrn Prime. All Rights Reserved.</p>
                          </div>
                      </div>
                  </div>
              </div>
          </body>
          </html>
          
            `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
