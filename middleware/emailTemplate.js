const WATERMARK_URL =
  "https://res.cloudinary.com/dfefiap2l/image/upload/v1761935062/Email_footer_banner_1_iyfoix.png";
const LOGO_URL = "https://ya-ti-pauy.vercel.app/assets/logo-B_SQKxUG.png";
const LINKEDIN_URL =
  "https://res.cloudinary.com/dbzzkaa97/image/upload/v1754433533/linkedIn_ggxxm4.png";
const INSTAGRAM_URL =
  "https://res.cloudinary.com/dbzzkaa97/image/upload/v1754433533/instagram_p8byzw.png";
const FACEBOOK_URL =
  "https://res.cloudinary.com/dbzzkaa97/image/upload/v1754433532/facebook_rjeokq.png";

const getDate = new Date().getFullYear();

// Brand Colors
const PRIMARY_BLUE = "#4caf50";
const SUCCESS_GREEN = "#002611";
const WARNING_ORANGE = "#E9C46A";
const ALERT_RED = "#E76F51";

const baseEmailTemplate = (title, mainContent, accentColor = PRIMARY_BLUE) => {
  const containerStyle = `
    max-width: 600px;
    margin: 0 auto;
    background-color: rgba(255, 254, 254, 1);
    font-family: 'Poppins', sans-serif;
    padding: 20px 0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 38, 17, 0.82);
  `;
  const footerBgStyle = `
    background: url(${WATERMARK_URL}) center / cover no-repeat;
    padding: 40px 0;
    text-align: center;
    color: #fff;
  `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  <style>
    body, table, td, a { margin: 0; padding: 0; border-collapse: collapse; line-height: 1.6; }
    img { border: none; -ms-interpolation-mode: bicubic; }
    a { text-decoration: none; }
    @media only screen and (max-width: 600px) {
      .full-width { width: 100% !important; }
      .content-padding { padding: 20px !important; }
      .header-logo img { width: 100px !important; }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #fff; font-family: 'Poppins', sans-serif;">
  <center style="width: 100%;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f4f4;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="${containerStyle}" class="full-width">

            <!-- Accent Bar -->
            <tr>
              <td style="height: 5px; background-color: ${accentColor};"></td>
            </tr>

            <!-- Logo -->
            <tr>
              <td style="padding: 25px 30px; text-align: center; border-bottom: 1px solid #eeeeee;" class="header-logo">
                <img src="${LOGO_URL}" width="140" alt="Asset Development Logo" style="display: block; margin: 0 auto;">
              </td>
            </tr>

            <!-- Main Content -->
            <tr>
              <td style="padding: 30px;" class="content-padding">
                ${mainContent}
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="${footerBgStyle}">
                <table width="80%" cellpadding="0" cellspacing="0" border="0" style="color: #ffffff; margin: 0 auto;">
                  <tr>
                    <td align="center">
                      <h3 style="margin: 0; font-size: 22px;">Asset Development</h3>
                      <p style="margin: 8px 0 20px; font-size: 13px;">Powerful Community-Driven Financial Model.</p>
                      <div style="margin-top: 10px;">
                        <a href="https://www.linkedin.com/company/traceaid" target="_blank" style="margin: 0 6px;">
                          <img src="${LINKEDIN_URL}" width="20" alt="LinkedIn" style="vertical-align: middle;">
                        </a>
                        <a href="https://web.facebook.com/profile.php?id=61578288375402" target="_blank" style="margin: 0 6px;">
                          <img src="${FACEBOOK_URL}" width="20" alt="Facebook" style="vertical-align: middle;">
                        </a>
                        <a href="https://www.instagram.com/traceaid" target="_blank" style="margin: 0 6px;">
                          <img src="${INSTAGRAM_URL}" width="20" alt="Instagram" style="vertical-align: middle;">
                        </a>
                      </div>
                      <p style="margin-top: 15px; font-size: 13px;">
                        Contact us:
                        <a href="mailto:yatihelpdesk@gmail.com" style="color: #fff; text-decoration: underline;">
                          yatihelpdesk@gmail.com
                        </a>
                      </p>
                      <p style="font-size: 12px; margin-top: 10px;">&copy; ${getDate} Asset Development. All rights reserved.</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </center>
</body>
</html>
  `;
};

exports.referrial = (referrer) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">You've Got A New Referral</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${referrer.fullName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      A new user joined Asset Development using your referral link. Thank you for growing our community!
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Welcome to Asset Development", mainContent);
};

exports.registerEmail = (userData) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Welcome To Asset Development</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.fullName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your Asset Development account was created successfully. Start exploring community-driven financial growth today!
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Welcome to Asset Development", mainContent);
};
exports.loginEmail = (userData) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Recent Login Activity</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.fullName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      You’ve logged into your Asset Development account. If this wasn’t you, secure your account immediately.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Recent Login Activity", mainContent);
};
exports.forgetPasswordEmail = (userData, resetLink) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Password Reset Request</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      You requested a password reset. Click the button below to update your credentials:
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetLink}" style="background-color: ${PRIMARY_BLUE}; color: #fff; padding: 12px 20px; border-radius: 6px; font-weight: 600; display: inline-block;">
        Reset Password
      </a>
    </div>
    <p style="font-size: 14px; color: #999;">
      If you didn’t request this, please ignore this email.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Password Reset Request", mainContent);
};

exports.passwordChangeEmail = (userData) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Welcome To Asset Development</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your Asset Development password was changed successfully. Contact us if you didn’t make this change.  
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Password Change Success", mainContent);
};

exports.changePasswordEmail = (userData) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Password Changed Successfully</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your password has been changed successfully. If this was you, no further action is needed.
    </p>
    <p style="font-size: 14px; color: #999;">
      If you did not initiate this change, please reset your password immediately or contact our support team.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Password Change Confirmation", mainContent);
};

exports.pinCreatedEmail = (userData) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">PIN Created Successfully</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your transaction PIN has been created successfully. You can now securely authorize payments and access sensitive features.
    </p>
    <p style="font-size: 14px; color: #999;">
      If you did not initiate this action, please update your PIN immediately or contact support.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("PIN Created Successfully", mainContent);
};

exports.pinChangedEmail = (userData) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">PIN Changed Successfully</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your transaction PIN has been changed successfully. You can now continue using Asset Development securely.
    </p>
    <p style="font-size: 14px; color: #999;">
      If you did not initiate this change, please reset your PIN immediately or contact our support team.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("PIN Change Confirmation", mainContent);
};

exports.RequestDEmail = (user, deposit) => {
  const displayName = user.userName || user.fullName || "Valued User";
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Deposit Request Initiated</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hello ${displayName},</p>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">
      We have received your deposit request of <strong>$${deposit.amount}</strong>.
    </p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Payment Method: <strong>${deposit.paymentMethod || "Not specified"}</strong>.
      Our team will review and process this deposit shortly.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Deposit Request Initiated", mainContent);
};

exports.depositCompletedEmail = (userData, deposit) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Deposit Completed</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
         Your deposit of <strong>$${deposit.amount}</strong> is now in your Asset Development Back Office. Start growing and earning with the community!    
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Deposit Completed", mainContent);
};

exports.withdrawalRequestEmail = (userData) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Withdrawal Request Initiated</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
         Your withdrawal request is being processed. Allow up to 48 hours for completion.    
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Withdrawal Request Initiated", mainContent);
};

exports.withdrawalCompletedEmail = (userData, withdrawal) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Withdrawal Completed</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your withdrawal of $${withdrawal.amount} has been processed successfully and sent to your linked address. Thank you for choosing Asset Development! 
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Withdrawal Completed", mainContent);
};

exports.contributionCycleStartsEmail = (userData, subscription) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Your Contribution Cycle Starts Soon</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
         Wow! We are excited about your earnings so far, and we believe you are too.    
    </p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
         Your next contribution of ${subscription.amount} begins in 24 hours You may wish to upgrade too.
    </p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
         Ensure funds are in your wallet for seamless processing, trading and more daily profits.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Your Contribution Cycle Starts Soon", mainContent);
};

exports.referralCommissionEmail = (userData, commissionAmount) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Referral Commission Earned</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${
      userData.userName
    },</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Great news! You've just earned a referral commission of <strong>$${commissionAmount.toFixed(
        2,
      )}</strong> for inviting a new member to Asset Development.
    </p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Thank you for helping grow our community. Your bonus has been added to your account balance.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Keep sharing and keep earning!</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Referral Commission Earned", mainContent);
};

exports.subscriptionCreatedEmail = (userData, subscription) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Subscription Created Successfully</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${
      userData.userName
    },</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your subscription of <strong>$${subscription.amount.toFixed(
        2,
      )}</strong> has been successfully activated on <strong>${new Date(
        subscription.startDate,
      ).toLocaleDateString()}</strong>.
    </p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      You’ll begin earning daily interest and can track your progress in your dashboard.
    </p>
    <p style="font-size: 14px; color: #999;">
      If you have any questions or didn’t authorize this subscription, please contact our support team immediately.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Welcome aboard!</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Subscription Created Successfully", mainContent);
};

exports.subscriptionRecycledEmail = (userData, subscription) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Subscription Recapitalize Successfully</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${
      userData.userName
    },</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your subscription of <strong>$${subscription.amount.toFixed(
        2,
      )}</strong> has been successfully Recapitalize. Your new cycle begins on <strong>${new Date(
        subscription.startDate,
      ).toLocaleDateString()}</strong> and ends on <strong>${new Date(
        subscription.endDate,
      ).toLocaleDateString()}</strong>.
    </p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      You’ll continue earning daily interest and enjoying all your benefits without interruption.
    </p>
    <p style="font-size: 14px; color: #999;">
      If you didn’t authorize this action, please contact our support team immediately.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Thank you for staying with us!</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate(
    "Subscription Recapitalize Successfully",
    mainContent,
  );
};

exports.planUpgradedEmail = (
  userData,
  oldAmount,
  newAmount,
  upgradeDifference,
  planName,
) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">🚀 Plan Upgraded Successfully</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Congratulations! Your plan has been successfully upgraded to a higher investment level.
    </p>
    <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f9f9f9; border-radius: 6px; margin: 20px 0; border: 1px solid #eee;">
      <tr>
        <td style="padding: 15px 20px; border-bottom: 1px solid #eee; font-size: 14px; color: #666;">Previous Amount</td>
        <td style="padding: 15px 20px; border-bottom: 1px solid #eee; font-size: 16px; font-weight: 600; color: #333;"><strong>$${oldAmount.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td style="padding: 15px 20px; border-bottom: 1px solid #eee; font-size: 14px; color: #666;">New Amount</td>
        <td style="padding: 15px 20px; border-bottom: 1px solid #eee; font-size: 16px; font-weight: 600; color: #333;"><strong>$${newAmount.toFixed(2)}</strong></td>
      </tr>
      <tr>
        <td style="padding: 15px 20px; font-size: 14px; color: #666;">Upgrade Charge</td>
        <td style="padding: 15px 20px; font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE};"><strong>$${upgradeDifference.toFixed(2)}</strong></td>
      </tr>
    </table>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">
      Your plan has been updated to <strong>${planName}</strong>. With this upgrade, you'll enjoy:
    </p>
    <ul style="font-size: 16px; margin-bottom: 25px; color: #333; padding-left: 20px;">
      <li>Higher daily interest earnings</li>
      <li>Enhanced earning potential</li>
      <li>Access to premium features</li>
    </ul>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your updated investment will begin earning at the new rate immediately. Check your dashboard to monitor your progress.
    </p>
    <p style="font-size: 14px; color: #999;">
      If you didn't authorize this upgrade or have any questions, please contact our support team immediately.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Thank you for growing with Asset Development!</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate(
    "Plan Upgraded Successfully",
    mainContent,
    PRIMARY_BLUE,
  );
};

exports.adminPasswordUpdateEmail = (userData) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Your Password Was Updated by Admin</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your account password was updated by an administrator. You can now log in using your new credentials.
    </p>
    <p style="font-size: 14px; color: #999;">
      If you did not request this change or have concerns, please contact our support team immediately.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Stay secure, stay empowered.</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Admin-Initiated Password Update", mainContent);
};

exports.userBlockedEmail = (userData) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: ${ALERT_RED}; margin-bottom: 20px;">Account Blocked</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your Asset Development account has been blocked by an administrator.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Account Blocked", mainContent);
};

exports.userUnblockedEmail = (userData) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: ${SUCCESS_GREEN}; margin-bottom: 20px;">Account Unblocked</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your Asset Development account has been unblocked by an administrator. You now have full access to your account and services.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Welcome back!</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Account Unblocked", mainContent);
};

exports.firstTimeReferralBonusEmail = (userData, bonusAmount) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">🎉 First Time Referral Bonus Earned!</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${
      userData.userName
    },</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Congratulations! You've earned a <strong>$${bonusAmount.toFixed(
        2,
      )}</strong> bonus for referring a new member to Asset Development.
    </p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      This is your first successful referral — thank you for helping us grow our community!
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Keep sharing your invite link and keep earning!</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("First Time Referral Bonus", mainContent);
};
exports.recurringReferralBonusEmail = (referrer, bonusAmount) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">🎉 Recurring Referral Bonus Earned!</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${
      referrer.userName
    },</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Great news! One of your invited users just renewed their subscription, and you've earned a recurring referral bonus of <strong>$${bonusAmount.toFixed(
        2,
      )}</strong>.
    </p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      This bonus has been added to your account balance. Keep referring and keep earning!
    </p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Thank you for being a valued part of our community.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Keep sharing your invite link and keep earning!</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Recurring Referral Bonus", mainContent);
};

exports.phoneNumberUpdatedEmail = (user) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">📱 Phone Number Updated</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${user.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your phone number has been successfully updated in your account settings.
    </p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      If you did not make this change or believe it was made in error, please contact our support team immediately.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Thank you for keeping your account up to date.</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Phone Number Updated", mainContent);
};

exports.walletInfoUpdatedEmail = (user) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">💼 Wallet Information Added</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${user.userName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Your wallet information has been successfully Added in your account settings.
    </p>
    <p style="font-size: 16px; margin-bottom: 25px; color: 
    #333;">
      If you did not make this change or believe it was made in error, please contact our support team immediately.
    </p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Thanks for keeping your account secure and up to date.</p>
    <p style="font-size: 16px; font-weight: 600; color: ${PRIMARY_BLUE}; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Wallet Info Added", mainContent);
};

exports.dailyInterestAddedEmail = (user, subscription, amount) => {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="color: #0A3D2E;">💰 Daily Interest Added</h2>

      <p>Hi <strong>${user.userName}</strong>,</p>

      <p>Your daily interest has just been added to your wallet.</p>

      <p>
        <strong>Plan:</strong> ${subscription.planName || "Your Plan"} <br/>
        <strong>Interest Amount:</strong> $${amount.toFixed(2)} <br/>
        <strong>Date:</strong> ${new Date().toLocaleString()}
      </p>

      <p>
        Your updated account balance is now <strong>$${user.accountBalance.toFixed(
          2,
        )}</strong>.
      </p>

      <p>If you have any questions, feel free to contact support.</p>

      <p style="margin-top: 30px; font-weight: bold; color: #0A3D2E;">
        Asset Development Team
      </p>
    </div>
  `;
};

// Contact Us Confirmation Email - To User
exports.contactUsConfirmationEmail = (contactData) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">We Received Your Message</h1>
    
    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
      Dear <strong>${contactData.fullName}</strong>,
    </p>

    <p style="font-size: 14px; color: #555; line-height: 1.8;">
      Thank you for contacting Asset Development! We have successfully received your message and appreciate you taking the time to reach out to us.
    </p>

    <div style="background-color: #f9f9f9; border-left: 4px solid ${PRIMARY_BLUE}; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <h3 style="color: #002611; margin-top: 0;">Message Summary:</h3>
      <p style="margin: 8px 0;"><strong>Email:</strong> ${contactData.email}</p>
      <p style="margin: 8px 0; word-break: break-word;"><strong>Message:</strong></p>
      <p style="margin: 8px 0; color: #666; font-style: italic;">${contactData.message}</p>
    </div>

    <p style="font-size: 14px; color: #555; line-height: 1.8;">
      Our support team will review your inquiry and get back to you within <strong>24-48 hours</strong>. We're committed to providing you with the best assistance possible.
    </p>

    <p style="font-size: 14px; color: #555; line-height: 1.8; margin-top: 20px;">
      If you need immediate assistance, please don't hesitate to contact us through our chat support feature on the platform.
    </p>

    <p style="margin-top: 30px; font-weight: bold; color: #0A3D2E;">
      Best regards,<br>
      Asset Development Team
    </p>
  `;

  return baseEmailTemplate("Contact Us Confirmation", mainContent);
};

// Contact Us Notification Email - To Admin
exports.contactUsAdminNotification = (contactData) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">New Contact Us Message</h1>
    
    <p style="font-size: 16px; color: #333; margin-bottom: 20px;">
      You have received a new contact message from a user.
    </p>

    <div style="background-color: #fff3cd; border-left: 4px solid ${WARNING_ORANGE}; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <h3 style="color: #856404; margin-top: 0;">Sender Information:</h3>
      <p style="margin: 8px 0;"><strong>Name:</strong> ${contactData.fullName}</p>
      <p style="margin: 8px 0;"><strong>Email:</strong> <a href="mailto:${contactData.email}" style="color: ${PRIMARY_BLUE};">${contactData.email}</a></p>
    </div>

    <div style="background-color: #f0f0f0; border-left: 4px solid ${PRIMARY_BLUE}; padding: 20px; margin: 20px 0; border-radius: 4px;">
      <h3 style="color: #002611; margin-top: 0;">Message:</h3>
      <div style="background-color: #ffffff; padding: 15px; border-radius: 4px; margin-top: 12px; border: 1px solid #ddd;">
        <p style="margin: 10px 0; color: #333; white-space: pre-wrap; word-break: break-word;">${contactData.message}</p>
      </div>
    </div>

    <div style="margin: 20px 0; padding: 15px; background-color: #e8f5e9; border-radius: 4px;">
      <p style="margin: 0;"><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
      <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: ${WARNING_ORANGE}; font-weight: bold;">PENDING</span></p>
    </div>

    <p style="font-size: 14px; color: #555; margin-top: 20px;">
      Please review this message and respond to the user as soon as possible.
    </p>

    <p style="margin-top: 30px; font-weight: bold; color: #0A3D2E;">
      Asset Development Admin System
    </p>
  `;

  return baseEmailTemplate(
    "New Contact Us Message - Action Required",
    mainContent,
    WARNING_ORANGE,
  );
};

exports.adminCustomMessageEmail = (userData, customMessage) => {
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Message from Asset Development Admin</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${userData.userName || userData.email},</p>
    
    <div style="margin: 25px 0; padding: 20px; background-color: #f5f5f5; border-left: 4px solid ${PRIMARY_BLUE}; border-radius: 4px;">
      <p style="font-size: 15px; color: #333; line-height: 1.8; margin: 0; white-space: pre-wrap;">${customMessage}</p>
    </div>

    <p style="font-size: 14px; color: #666; margin-top: 25px;">
      If you have any questions or concerns, please contact our support team.
    </p>

    <p style="margin-top: 30px; font-weight: bold; color: #0A3D2E;">
      Best regards,<br>
      Asset Development Team
    </p>
  `;

  return baseEmailTemplate(
    "Message from Asset Development Admin",
    mainContent,
    PRIMARY_BLUE,
  );
};

exports.transferSentEmail = (user, transfer) => {
  const displayName = user.fullName || user.userName || "Valued User";
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">Transfer Sent Successfully</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${displayName},</p>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">
      Your transfer has been processed successfully. Here's a summary:
    </p>
    <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; margin-bottom: 20px;">
      <tr style="border-bottom: 1px solid #eee;">
        <td style="color: #555;">Recipient</td>
        <td style="text-align: right; font-weight: 600; color: #002611;">${transfer.recipientName}</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="color: #555;">Transfer Amount</td>
        <td style="text-align: right; font-weight: 600; color: #002611;">$${transfer.amount.toFixed(2)}</td>
      </tr>
      <tr style="border-bottom: 1px solid #eee;">
        <td style="color: #555;">Transfer Charge (${0}%)</td>
        <td style="text-align: right; color: #555;">$${transfer.charge.toFixed(2)}</td>
      </tr>
      <tr>
        <td style="color: #555; font-weight: 600;">Total Deducted</td>
        <td style="text-align: right; font-weight: 700; color: #002611;">$${transfer.totalDeducted.toFixed(2)}</td>
      </tr>
    </table>
    <p style="font-size: 14px; color: #999;">Transfers are processed instantly and cannot be reversed.</p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: #4caf50; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Transfer Sent Successfully", mainContent);
};

exports.transferReceivedEmail = (user, transfer) => {
  const displayName = user.fullName || user.userName || "Valued User";
  const mainContent = `
    <h1 style="font-size: 24px; color: #002611; margin-bottom: 20px;">You've Received a Transfer</h1>
    <p style="font-size: 16px; margin-bottom: 15px; color: #333;">Hi ${displayName},</p>
    <p style="font-size: 16px; margin-bottom: 25px; color: #333;">
      Great news! <strong>${transfer.senderName}</strong> has sent you a transfer of 
      <strong>$${transfer.amount.toFixed(2)}</strong>. The funds have been added to your account balance.
    </p>
    <p style="font-size: 14px; color: #999;">Log in to your account to view your updated balance.</p>
    <p style="font-size: 16px; margin-top: 20px; color: #333;">Regards,</p>
    <p style="font-size: 16px; font-weight: 600; color: #4caf50; margin: 0;">Asset Development Team.</p>
  `;
  return baseEmailTemplate("Funds Received", mainContent);
};
