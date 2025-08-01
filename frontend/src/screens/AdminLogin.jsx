import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';
import { login } from '../services/api';
import { AuthContext } from '../navigation/AdminNavigator';
import '../styles/AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('AdminLogin: Attempting login with', { email });
      const response = await login({ email, password });
      if (response.success) {
        console.log('AdminLogin: Login successful, navigating to AdminDashboard');
        setIsAuthenticated(true);
        navigate('/admin-dashboard');
      } else {
        setError(response.message || 'Invalid email or password');
        console.log('AdminLogin: Login failed:', response.message);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('AdminLogin error:', err);
    }
  };

  return (
    <motion.div
      className="admin-login-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <AdminHeader />
      <motion.div
        className="form-container"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <h2 className="title">Admin Login</h2>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
          />
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <button
          onClick={() => navigate('/admin-signup')}
          className="signup-button"
        >
          Don't have an account? Sign Up
        </button>
      </motion.div>
    </motion.div>
  );
}