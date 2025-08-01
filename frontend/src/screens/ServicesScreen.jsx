import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import HeaderRow from '../components/HeaderRow';
import { getServices } from '../services/api';
import '../styles/ServicesScreen.css';

export default function ServicesScreen() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  useEffect(() => {
    getServices()
      .then(data => setServices(data))
      .catch(error => console.error('Services fetch error:', error));
  }, []);

  return (
    <motion.div
      className="services-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <HeaderRow />
      <div className="content">
        <h2 className="title">Our Services</h2>
        <div className="services-list">
          {services.map(item => (
            <div key={item.id} className="service-item">
              <span className="service-name">{item.name}</span>
              <span className="service-description">{item.description}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}