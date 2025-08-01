import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeaderRow from '../components/HeaderRow';
import { register, verifyOtp } from '../services/api';
import '../styles/AdminSignup.css';

export default function AdminSignup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('register');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      const response = await register({ name, email, password, role: 'Admin' });
      if (response.success) {
        setStep('verify');
        setError('');
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp({ email, otp });
      if (response.success) {
        navigate('/admin-login');
      } else {
        setError(response.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('OTP verification failed. Please try again.');
      console.error('OTP verification error:', err);
    }
  };

  return (
    <motion.div
      className="admin-signup-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderRow />
      <div className="form-container">
        <h2 className="title">{step === 'register' ? 'Admin Sign Up' : 'Verify OTP'}</h2>
        {error && <span className="error-text">{error}</span>}
        {step === 'register' ? (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
            <button onClick={handleRegister} className="button">
              Send OTP
            </button>
            <button
              onClick={() => navigate('/admin-login')}
              className="link-button"
            >
              Already have an account? Login
            </button>
          </>
        ) : (
          <>
            <span className="subtitle">Enter the OTP sent to {email}</span>
            <input
              type="text"
              placeholder="OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input"
            />
            <button onClick={handleVerifyOtp} className="button">
              Verify OTP
            </button>
            <button
              onClick={handleRegister}
              className="link-button"
            >
              Resend OTP
            </button>
          </>
        )}
      </div>
    </motion.div>
  );
}