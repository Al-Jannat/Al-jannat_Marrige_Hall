require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: 'Your OTP for Admin Registration - Al Jannat',
    text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`OTP email sent to ${email}: Message ID ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Email sending error:', {
      message: error.message,
      code: error.code,
      response: error.response,
      responseCode: error.responseCode,
    });
    throw error;
  }
};

module.exports = { sendOtpEmail };