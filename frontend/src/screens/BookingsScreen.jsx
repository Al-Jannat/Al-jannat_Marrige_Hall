import React from 'react';
import { motion } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/Sidebar';
import '../styles/BookingsScreen.css';

export default function BookingsScreen() {
  return (
    <motion.div
      className="bookings-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AdminHeader />
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <h2 className="title">Bookings</h2>
          <p className="subtitle">Placeholder for booking management.</p>
        </div>
      </div>
    </motion.div>
  );
}