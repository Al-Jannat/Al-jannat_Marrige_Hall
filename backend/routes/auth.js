const express = require('express');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const User = require('../models/User');
const OTP = require('../models/OTP');
const { sendOtpEmail } = require('../utils/mailSender');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  console.log('Registration attempt:', { name, email, role });
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const otp = crypto.randomInt(100000, 999999).toString();
    console.log('Generated OTP:', otp);
    await OTP.create({ email, otp });
    console.log('OTP saved to MongoDB:', { email, otp });

    await sendOtpEmail(email, otp);
    console.log('OTP email sent successfully to:', email);

    await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: role || 'Admin',
      isVerified: false,
    });
    console.log('User created in MongoDB:', { name, email, role });

    res.status(200).json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error('Registration error:', {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  console.log('OTP verification attempt:', { email, otp });
  try {
    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) {
      console.log('Invalid OTP:', { email, otp });
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    await User.updateOne({ email }, { isVerified: true });
    await OTP.deleteOne({ email, otp });
    console.log('OTP verified, user updated:', email);

    res.status(200).json({ success: true, message: 'Email verified' });
  } catch (err) {
    console.error('OTP verification error:', {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', { email });
  try {
    const user = await User.findOne({ email });
    if (!user || !user.isVerified) {
      console.log('User not found or not verified:', email);
      return res.status(400).json({ success: false, message: 'User not found or not verified' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Invalid credentials:', email);
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    console.log('Login successful:', email);
    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', {
      message: err.message,
      stack: err.stack,
    });
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;