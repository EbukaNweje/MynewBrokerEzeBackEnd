const subject1 = "Welcome To Asset Development";
const emailText1 = `
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
                background-color: #333;
                color: #fff;
                text-align: center;
                padding: 10px;
            }
            .content {
                padding: 20px;
            }
        </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome To Asset Development</h1>
                </div>
                <div class="content">
                    <p>Hello ${newUser.userName},</p>
                    <p>Your Asset Development account was created successfully. Start exploring community-driven financial growth today!</p>
                </div>
                <div class="content">
                    <p>Regards,</p>
                    <p><b>Asset Development Team.</b></p>
                </div>
                <div class="footer">
                    <p>&copy; ${getDate} Asset Development. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        `;

const subject = "You've Got A New Referral";
const emailText = `
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
                        background-color: #333;
                        color: #fff;
                        text-align: center;
                        padding: 10px;
                    }
                    .content {
                        padding: 20px;
                    }
                </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Welcome To Asset Development</h1>
                        </div>
                        <div class="content">
                            <p>Hello ${referrer.userName},</p>
                            <p>A new user joined Asset Development using your referral link. Thank you for growing our community!</p>
                        </div>
                        <div class="content">
                            <p>Regards,</p>
                            <p><b>Asset Development Team.</b></p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${getDate} Your Website. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
                `;

exports.forgotPasswordLink = (resetUrl, firstname) => {
  const mainContent = `
        <h1 style="font-size: 24px; color: ${PRIMARY_BLUE}; margin-bottom: 20px;">Password Reset Request</h1>
        <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${firstname},</p>
        <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
            You requested a password reset for your TraceAid account. Click the button below to securely set a new password.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
            <tr>
                <td align="center">
                    <a href="${resetUrl}" target="_blank"
                       style="display: inline-block; background-color: ${PRIMARY_BLUE}; color: #ffffff; font-size: 16px; 
                       font-weight: 600; text-decoration: none; padding: 12px 30px; border-radius: 5px; border: 1px solid ${PRIMARY_BLUE};">
                        Reset My Password
                    </a>
                </td>
            </tr>
        </table>
        <p style="font-size: 14px; color: ${ALERT_RED}; margin-top: 20px; font-weight: 600;">
            This link is valid for a limited time.
        </p>
        <p style="font-size: 14px; margin-top: 30px; color: #777;">
            If you did not request this, please ignore this email. Your account remains secure.
        </p>
        <p style="font-size: 16px; margin-top: 25px; color: #333;">Stay safe,</p>
        <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">The TraceAid Team</p>
    `;
  return baseEmailTemplate("Password Reset Request", mainContent);
};

exports.emailVerificationOTP = (firstName, verificationCode) => {
  const mainContent = `
        <h1 style="font-size: 24px; color: ${PRIMARY_BLUE}; margin-bottom: 20px;">Verify Your TraceAid Account</h1>
        <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${firstName},</p>
        <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
            Welcome to TraceAid! To complete your registration and secure your account, please verify your email address using the code below:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
                <td align="center" style="padding: 15px 20px; background-color: #f0f4f7; border-radius: 8px;">
                    <p style="font-size: 18px; color: #555; margin: 0;">Your verification code:</p>
                    <p class="code-box" style="font-size: 32px; font-weight: 700; color: ${PRIMARY_BLUE}; margin: 10px 0 0;">
                        ${verificationCode}
                    </p>
                </td>
            </tr>
        </table>
        <p style="font-size: 14px; color: ${ALERT_RED}; margin-top: 20px; font-weight: 600;">
            This code will expire in 10 minutes.
        </p>
        <p style="font-size: 14px; margin-top: 30px; color: #777;">
            If you didn’t sign up for a TraceAid account, you can safely ignore this email.
        </p>
        <p style="font-size: 16px; margin-top: 25px; color: #333;">Thanks for joining the movement for transparent giving,</p>
        <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">The TraceAid Team</p>
    `;
};
