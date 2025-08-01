import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeaderRow from '../components/HeaderRow';
import '../styles/LocateUsScreen.css';

export default function LocateUsScreen() {
  const navigate = useNavigate();
  const categories = [
    { name: 'Venue', icon: 'fas fa-church', path: '/category-images/Venue' },
    { name: 'Events', icon: 'fas fa-calendar-alt', path: '/category-images/Events' },
    { name: 'Catering', icon: 'fas fa-utensils', path: '/category-images/Catering' },
    { name: 'Ceremonies', icon: 'fas fa-ring', path: '/category-images/Ceremonies' },
    { name: 'Locate Us', icon: 'fas fa-map-marker-alt', path: '/locate' },
    { name: 'Menu', icon: 'fas fa-book', path: '/menu' },
  ];

  return (
    <motion.div
      className="container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderRow />
      <h1 className="title">Locate Us</h1>
      <div className="map-container">
        <iframe
          className="map-iframe"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3365.4369158356712!2d73.41725947641552!3d32.48774957378575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3921d8328f1922f9%3A0xa4afe1d7d9bf2223!2sAl-Jannat%20Marriage%20Hall!5e0!3m2!1sen!2s!4v1753727306989!5m2!1sen!2s"
          title="Google Map of Al-Jannat Marriage Hall"
          allowFullScreen=""
          loading="lazy"
        />
      </div>
      <motion.div
        className="category-section"
        initial={{ scale: 0.8, opacity: 0, boxShadow: '0 0 0 rgba(152, 215, 194, 0)' }}
        animate={{ scale: 1, opacity: 1, boxShadow: '0 0 20px rgba(152, 215, 194, 0.5)' }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 120 }}
      >
        <div className="category-list">
          {categories.map((item) => (
            <motion.button
              key={item.name}
              className="category-card"
              onClick={() => navigate(item.path)}
              whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(152, 215, 194, 0.7)' }}
              whileTap={{ scale: 0.95 }}
            >
              <i className={item.icon} />
              <span>{item.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
      <motion.div
        className="contact-section"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="contact-title">Contact Us</h2>
        <div className="contact-info">
          <div className="contact-item">
            <i className="fas fa-map-marker-alt contact-icon" />
            <span>Al-Jannat Marriage Hall, Ainowal, Sargodha Mandi Bahauddin Rd, Bhikhi Sharif</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-phone contact-icon" />
            <span>+92 342 645 0000</span>
          </div>
          <div className="contact-item">
            <i className="fas fa-envelope contact-icon" />
            <span>aljannatmarraigehall@gmail.com</span>
          </div>
          
        </div>
      </motion.div>
    </motion.div>
  );
}