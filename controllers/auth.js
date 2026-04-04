const User = require("../models/User");
const bcrypt = require("bcrypt");
const createError = require("../utilities/error");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const otpGenerator = require("otp-generator");
// const transporter = require("../utilities/email");
const {
  registerEmail,
  referrial,
  loginEmail,
  RequestDEmail,
} = require("../middleware/emailTemplate");
const { sendEmail } = require("../utilities/brevo");

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(createError(400, errors.array()[0].msg));
    }

    const {
      email,
      password: pwd,
      confirmPassword: confPwd,
      referralCode,
      fullName,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email already exists" });
    }

    if (pwd !== confPwd) {
      return next(createError(400, "Passwords do not match"));
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(pwd, salt);
    const confPwdhash = await bcrypt.hash(confPwd, salt);

    const newUser = new User({
      email,
      password: hash,
      confirmPassword: confPwdhash,
      fullName,
    });

    // Generate Invite Code
    const codeNum = otpGenerator.generate(4, {
      digits: true,
      upperCaseAlphabets: true,
      lowerCaseAlphabets: true,
      specialChars: false,
    });
    const inviteName = newUser.fullName.replace(/\s+/g, "").toLowerCase();
    const InviteCode = `${inviteName}${codeNum}`;
    newUser.inviteCode.code = InviteCode;

    // Handle Referral
    if (referralCode) {
      const referrer = await User.findOne({ "inviteCode.code": referralCode });
      if (referrer) {
        // const bonusAmount = 15;
        // referrer.accountBalance += bonusAmount;
        referrer.inviteCode.userInvited.push(newUser._id);
        referrer.referralCount += 1;

        await referrer.save();

        const emailDetails = {
          email: referrer.email,
          subject: "You've Got A New Referral",
          html: referrial(referrer),
        };

        sendEmail(emailDetails);
      }
    }

    // Generate JWT token (from original)
    const token = jwt.sign(
      { id: newUser._id, isAdmin: newUser.isAdmin },
      process.env.JWT,
      { expiresIn: "15m" },
    );
    newUser.token = token;

    // Generate withdrawCode (from original)
    const otpCode = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    newUser.withdrawCode = otpCode;

    await newUser.save();

    // Generate Referral Link
    const referralLink = `https://assetdevelopment.vercel.app/register?referralCode=${newUser.inviteCode.code}`;

    const emailDetailsRegister = {
      email: newUser.email,
      subject: "Welcome To Asset Developments Investment Solutions",
      html: registerEmail(newUser),
    };
    sendEmail(emailDetailsRegister);

    const { password, confirmPassword, ...userData } = newUser._doc;

    res.status(201).json({
      message: "User registered successfully",
      data: {
        user: userData,
        referralLink,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "User not found!"));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(createError(400, "Wrong password or username"));
    }

    if (user.status === "blocked") {
      return next(createError(403, "Your account has been suspended"));
    }

    user.isLogin = "active";

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT,
      { expiresIn: "1d" },
    );
    user.token = token;

    // Generate Referral Link
    const referralLink = `https://assetdevelopment.vercel.app/register?referralCode=${user.inviteCode.code}`;

    await user.save();
    const emailDetails = {
      email: user.email,
      subject: "Recent Login Activity",
      html: loginEmail(user),
    };
    sendEmail(emailDetails);

    const {
      token: userToken,
      password: userPassword,
      confirmPassword: userConfirmPassword,
      isAdmin,
      ...otherDetails
    } = user._doc;

    res.status(200).json({
      ...otherDetails,
      referralLink,
      token,
    });
  } catch (error) {
    next(error);
  }
};

exports.tradingSession = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userInfo = await User.findById(id);
    console.log(userInfo);
    // const sessionEmail = User.findOne(({ email: req.body.email }))
    if (userInfo.accountBalance > 0) {
      let newDay = userInfo.newDay;
      const setter = setInterval(() => {
        newDay--;
        userInfo.newDay = newDay;
        userInfo.save();
        console.log(userInfo.newDay);
      }, 8.64e7);

      if (userInfo.newDay <= 0) {
        clearInterval(setter);
      } else {
        setter;
      }
    }
    res.status(201).json({
      message: "checking.",
      data: userInfo,
    });

    //       if(sessionEmail.accountBalance > 0){
    //         // Set the target date to day 0
    //       const targetDate = new Date('2023-11-01 00:00:00').getTime();
    //        currentDate = new Date().getTime();
    //       const timeDifference = targetDate - currentDate;

    // //     if (timeDifference <= 0) {
    // //         // When the countdown reaches day 0
    // //         return 'Countdown: Day 0';
    // //     } else {
    // //         // Calculate days
    // //         const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    // //         return {Countdown: Day ` ${days}`};
    // // }
    //  }
  } catch (err) {
    next(err);
  }
};

exports.resendotp = async (req, res, next) => {
  try {
    const otpCode = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      upperCase: false,
      specialChars: false,
    });
    const userId = req.params.id;

    const NewOtp = await User.findById(userId);
    NewOtp.otp = otpCode;
    NewOtp.save();

    const mailOptions = {
      from: process.env.USER,
      to: NewOtp.email,
      subject: "Verification Code",
      html: `
     <h4 style="font-size:25px"> Hi ${NewOtp.userName}!</h4> 

     <Span>Use the following one-time password (OTP) to sign in to your OKX EXCHANGE TRADE PLATFORM account. <br>
     This OTP will be valid for 15 minutes</span>

     <h1 style="font-size:30px; color: blue;"><b>${NewOtp.otp}</b></h1>

     <p>If you didn't initiate this action or if you think you received this email by mistake, please contact <br>
      okxexchangetrade@gmail.com
     </p>

     <p>Regards, <br>
     OKX EXCHANGE<br>
     okxexchange.org</p>
      `,
    };

    sendEmail(mailOptions);

    // transporter.sendMail(mailOptions, (err, info) => {
    //   if (err) {
    //     console.log("erro", err.message);
    //   } else {
    //     console.log("Email has been sent to your inbox", info.response);
    //   }
    // });
    res.status(200).json({
      status: "success",
      message: "Your Verification Code has been sent to your email",
    });
  } catch (err) {
    next(err);
  }
};

exports.verifySuccessful = async (req, res, next) => {
  try {
    const userid = req.params.id;
    console.log(userid);

    const verifyuser = await User.findById({ _id: userid });

    if (verifyuser.otp !== req.body.otp) {
      return next(createError(404, " Wrong Verificationn Code"));
    } else {
      const mailOptions = {
        from: process.env.USER,
        to: verifyuser.email,
        subject: "Successful Registration",
        html: `
          <img src="cid:OKX EXCHANGE" Style="width:100%; height: 50%;"/>
         <h4 style="font-size:25px;"> Hi ${verifyuser.fullName}!</h4> 

         <p>Welcome to OKX EXCHANGE TRADE PLATFORM, your Number 1 online trading platform.</p>

         <p> Your Trading account has been set up successfully with login details: <br>

         Email:  ${verifyuser.email} <br>
         Password: The password you registered with. <br><br>

         You can go ahead and fund your Trade account to start up your Trade immediately. Deposit through Bitcoin.<br> <br>

         For more enquiry kindly contact your account manager or write directly with our live chat support on our platform  <br> or you can send a direct mail to us at okxexchangetrade@gmail.com. <br> <br>

         Thank You for choosing our platform and we wish you a successful trading. <br>

         OKX EXCHANGETRADE TEAM (C)</p>
          `,
        attachments: [
          {
            filename: "OKX EXCHANGE.jpg",
            path: __dirname + "/OKX EXCHANGE.jpg",
            cid: "OKX EXCHANGE", //same cid value as in the html img src
          },
        ],
      };

      const mailOptionsme = {
        from: process.env.USER,
        to: process.env.USER,
        subject: "Successful Registration",
        html: `
           <p>
              ${verifyuser.fullName} <br>
              ${verifyuser.email}  <br>
              ${verifyuser.phoneNumber} <br>
              ${verifyuser.gender}  <br>
              ${verifyuser.country} <br>
              ${verifyuser.address}  <br>
                Just signed up now on your Platfrom 
           </p>
            `,
      };

      sendEmail(mailOptions);
      sendEmail(mailOptionsme);

      // transporter.sendMail(mailOptions, (err, info) => {
      //   if (err) {
      //     console.log("erro", err.message);
      //   } else {
      //     console.log("Email has been sent to your inbox", info.response);
      //   }
      // });

      // transporter.sendMail(mailOptionsme, (err, info) => {
      //   if (err) {
      //     console.log("erro", err.message);
      //   } else {
      //     console.log("Email has been sent to your inbox", info.response);
      //   }
      // });

      res.status(201).json({
        message: "verify Successful.",
        data: verifyuser,
      });
    }
  } catch (err) {
    next(err);
  }
};
exports.userverifySuccessful = async (req, res, next) => {
  try {
    const userid = req.params.id;
    console.log(userid);
    const verifyuser = await User.findById({ _id: userid });
    const verify = verifyuser.verify;
    const UpdateUser = await User.findByIdAndUpdate(
      userid,
      { verify: true },
      {
        new: true,
      },
    );

    res.status(201).json({
      message: "verify Successful.",
      data: UpdateUser,
    });
  } catch (err) {
    next(err);
  }
};

exports.restLink = async (req, res, next) => {
  try {
    const id = req.params.id;
    const token = req.params.token;

    jwt.verify(token, process.env.JWT, async (err) => {
      if (err) {
        return next(createError(403, "Token not valid"));
      }
    });
    const userpaassword = await User.findById(id);
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    userpaassword.password = hash;
    userpaassword.save();
    res.status(200).json({
      status: "success",
      message: "you have successfuly change your password",
    });
  } catch (err) {
    next(err);
  }
};

exports.signupEmailSand = async (req, res, next) => {
  try {
    const email = req.body.email;

    const UserEmail = await User.findOne({ email });
    const mailOptions = {
      from: process.env.USER,
      to: UserEmail.email,
      subject: "Successful Sign Up!",
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
  <meta charset="utf-8"> <!-- utf-8 works for most cases -->
  <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
  <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
  <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
  <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">
  </head>
  <body style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
  <center style="width: 100%; background-color: #f1f1f1;">
  <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
  &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>
  <div style="max-width: 600px; margin: 0 auto;">
  <!-- BEGIN BODY -->
  <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
  <tr>
    <td valign="top" style="padding: 1em 2.5em 0 2.5em; background-color: #ffffff;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="text-align: center;">
            <h1 style="margin: 0;"><a href="#" style="color: #EABD4E; font-size: 24px; font-weight: 700; font-family: 'Lato', sans-serif;"> Apextradepro  </a></h1> 
          </td>
        </tr>
      </table>
    </td>
  </tr><!-- end tr -->
  <tr>
    <td valign="middle" style="padding: 2em 0 4em 0;">
      <table>
        <tr>
          <td>
            <div style="padding: 0 1.5em; text-align: center;">
              <h3 style="font-family: 'Lato', sans-serif; color: black; font-size: 30px; margin-bottom: 0; font-weight: 400;">Hi ${UserEmail.fullName}!</h3>
              <h4 style="font-family: 'Lato', sans-serif; font-size: 24px; font-weight: 300;">Welcome to Apextradepro , your Number 1 online trading platform.</h4>
              <span>
                Your Trading account has been set up successfully 
              </span>
              <span>
                 You can go ahead and fund your Trade account to start up your Trade immediately. Deposit through Bitcoin.
              </span>

              <p>
                For more enquiry kindly contact your account manager or write directly with our live chat support on our platform 
               <br> or you can send a direct mail to us at <span style="color: blue">${process.env.USER}.</span></p>

               <p>
                Thank You for choosing our platform and we wish you a successful trading.
               </p>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr><!-- end tr -->
  <!-- 1 Column Text + Button : END -->
  </table>
  </div>
  </center>
  </body>
  </html> 
     
      `,
    };

    const mailOptionsme = {
      from: process.env.USER,
      to: process.env.USER,
      subject: "Successful Registration",
      html: `
   <p>
          ${UserEmail.fullName} <br>
              ${UserEmail.email}  <br>
              ${UserEmail.phoneNumber} <br>
              ${UserEmail.gender}  <br>
              ${UserEmail.country} <br>
              ${UserEmail.address}  <br>
        Just signed up now on your Platfrom 
   </p>
    `,
    };

    // transporter.sendMail(mailOptions, (err, info) => {
    //   if (err) {
    //     console.log("erro", err.message);
    //   } else {
    //     console.log("Email has been sent to your inbox", info.response);
    //   }
    // });
    // transporter.sendMail(mailOptionsme, (err, info) => {
    //   if (err) {
    //     console.log("erro", err.message);
    //   } else {
    //     console.log("Email has been sent to your inbox", info.response);
    //   }
    // });
    sendEmail(mailOptions);
    sendEmail(mailOptionsme);

    res.status(200).json({
      status: "success",
      message: "Link sent to email!",
    });
  } catch (err) {
    next(err);
  }
};
exports.loginEmailSand = async (req, res, next) => {
  try {
    const email = req.body.email;
    const UserEmail = await User.findOne({ email });
    const mailOptions = {
      from: process.env.USER,
      to: UserEmail.email,
      subject: "Successful Login!",
      html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
  <meta charset="utf-8"> <!-- utf-8 works for most cases -->
  <meta name="viewport" content="width=device-width"> <!-- Forcing initial-scale shouldn't be necessary -->
  <meta http-equiv="X-UA-Compatible" content="IE=edge"> <!-- Use the latest (edge) version of IE rendering engine -->
  <meta name="x-apple-disable-message-reformatting">  <!-- Disable auto-scale in iOS 10 Mail entirely -->
  <title></title> <!-- The title tag shows in email notifications, like Android 4.4. -->
  <link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet">
  </head>
  <body style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;">
  <center style="width: 100%; background-color: #f1f1f1;">
  <div style="display: none; font-size: 1px;max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
  &zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;
  </div>
  <div style="max-width: 600px; margin: 0 auto;">
  <!-- BEGIN BODY -->
  <table align="center" role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: auto;">
  <tr>
    <td valign="top" style="padding: 1em 2.5em 0 2.5em; background-color: #ffffff;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
          <td style="text-align: center;">
            <h1 style="margin: 0;"><a href="#" style="color: #EABD4E; font-size: 24px; font-weight: 700; font-family: 'Lato', sans-serif;"> Apextradepro   </a></h1> 
          </td>
        </tr>
      </table>
    </td>
  </tr><!-- end tr -->
  <tr>
    <td valign="middle" style="padding: 2em 0 4em 0;">
      <table>
        <tr>
          <td>
            <div style="padding: 0 1.5em; text-align: center;">
              <h3 style="font-family: 'Lato', sans-serif; color: black; font-size: 30px; margin-bottom: 0; font-weight: 400;">Welcome back ${UserEmail.fullName}!</h3>
              <h4 style="font-family: 'Lato', sans-serif; font-size: 24px; font-weight: 300;">You have successfully logged in to,<br/> <span style=" font-weight: 500; color:#EABD4E; margin-top:-10px; font-size: 20px;"> Apextradepro  /span></h4>
              <span>If you did not initiate this, change your password immediately and send our Customer Center an email to <br/> <p style="color: blue">${process.env.USER}</p></span>
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr><!-- end tr -->
  <!-- 1 Column Text + Button : END -->
  </table>
  </div>
  </center>
  </body>
  </html> 
     
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

    res.status(200).json({
      status: "success",
      message: "Link sent to email!",
    });
  } catch (err) {
    next(err);
  }
};

exports.getrestlink = async (req, res, next) => {
  const id = req.params.id;
  const token = req.params.token;
  console.log(token, "token");
  console.log(id, "id");
  try {
    res.redirect(`http://okxexchange.org/restLink/${id}/${token}`);
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const userEmail = await User.findOne({ email: req.body.email });
    // console.log(userEmail)gi
    if (!userEmail) return next(createError(404, "No user with that email"));
    const token = jwt.sign({ id: userEmail._id }, process.env.JWT, {
      expiresIn: "10m",
    });
    const resetURL = `${req.protocol}://${req.get("host")}/api/restLink/${
      userEmail._id
    }/${token}`;

    const message = `Forgot your password? Submit patch request with your new password to: ${resetURL}.
           \nIf you didnt make this request, simply ignore. Password expires in 10 minutes`;

    const mailOptions = {
      from: process.env.USER,
      to: userEmail.email,
      subject: "Your password reset token is valid for 10 mins",
      text: message,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err.message);
      } else {
        console.log("Email has been sent to your inbox", info.response);
      }
    });
    res.status(200).json({
      status: "success",
      message: "Link sent to email!",
    });
  } catch (err) {
    next(err);
  }
};

exports.sendPaymentInfo = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { amount, paymentMethod } = req.body;
    const userInfo = await User.findById(id);

    if (!userInfo) {
      return next(createError(404, "User not found"));
    }

    const userEmailOptions = {
      email: userInfo.email,
      subject: "Deposit Request Received",
      html: RequestDEmail(userInfo, {
        amount,
        paymentMethod,
      }),
    };

    const adminEmailOptions = {
      email: process.env.USER,
      subject: "New Deposit Request",
      html: `
        <h1>New Deposit Request</h1>
        <p><strong>Name:</strong> ${userInfo.fullName}</p>
        <p><strong>Email:</strong> ${userInfo.email}</p>
        <p><strong>Amount:</strong> $${amount}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod || "Not specified"}</p>
      `,
    };

    await sendEmail(userEmailOptions);
    await sendEmail(adminEmailOptions);

    res.status(200).json({
      status: "success",
      message: "Deposit notification emails sent",
    });
  } catch (err) {
    next(err);
  }
};
