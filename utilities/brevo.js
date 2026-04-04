const axios = require("axios");
require("dotenv").config();

exports.sendEmail = async (options) => {
  try {
    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: process.env.BREVO_USER, name: "Asset Development" },
        to: [{ email: options.email }],
        subject: options.subject,
        htmlContent: options.html,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      },
    );
    console.log("Email sent successfully:", response.data);
  } catch (error) {
    console.error(
      "Error sending email:",
      error.response ? error.response.data : error.message,
    );
  }
};
