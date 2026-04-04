const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config({ path: "../config/index.env" });

const sendEmail = nodemailer.createTransport({
  service: "gmail",
  host: process.env.SERVICE,
  port: 465,
  auth: {
    user: process.env.USER,
    pass: process.env.EMAILPASS,
  },
  secure: true,
});

module.exports = sendEmail;

// const axios = require("axios");

// const sendEmail = async (options) => {
//   try {
//     const response = await axios.post(
//       "https://api.brevo.com/v3/smtp/email",
//       {
//         sender: { email: process.env.BREVO_USER, name: "Omega Exchange" },
//         to: [{ email: options.email }],
//         subject: options.subject,
//         htmlContent: options.html,
//       },
//       {
//         headers: {
//           "api-key": process.env.BREVO_API_KEY,
//           "Content-Type": "application/json",
//         },
//       }
//     );
//     console.log("Email sent successfully:", response.data);
//   } catch (error) {
//     console.error(
//       "Error sending email:",
//       error.response ? error.response.data : error.message
//     );
//   }
// };

// module.exports = sendEmail;

// const apiInstance = new Brevo.TransactionalEmailsApi();
// apiInstance.setApiKey(
//   Brevo.TransactionalEmailsApiApiKeys.apiKey,
//   process.env.BREVO_API_KEY
// );

// const sendSmtpEmail = new Brevo.SendSmtpEmail();
// sendSmtpEmail.subject = "Signup succesful";
// sendSmtpEmail.to = [{ email: user.email }];
// sendSmtpEmail.sender = {
//   name: "Omega Exchange",
//   email: process.env.BREVO_USER,
// };

// // sendSmtpEmail.htmlContent = sendHtml("https://goal.com", user.name);

// await apiInstance.sendTransacEmail();
