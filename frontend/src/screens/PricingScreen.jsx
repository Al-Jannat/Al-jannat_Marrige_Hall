import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getPricing } from '../services/api';
import '../styles/PricingScreen.css';

export default function PricingScreen() {
  const [pricing, setPricing] = useState([]);

  useEffect(() => {
    getPricing()
      .then(data => setPricing(data))
      .catch(error => console.error('Pricing fetch error:', error));
  }, []);

  return (
    <motion.div
      className="pricing-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="title">Pricing</h2>
      <div className="pricing-list">
        {pricing.map(item => (
          <div key={item.id} className="pricing-item">
            <span className="item-name">{item.name}</span>
            <span className="item-price">{item.price}</span>
            <span className="item-description">{item.description}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}