import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGallery } from '../services/api';
import '../styles/GalleryScreen.css';

export default function GalleryScreen() {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    getGallery()
      .then(data => setGallery(data))
      .catch(error => console.error('Gallery fetch error:', error));
  }, []);

  return (
    <motion.div
      className="gallery-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="title">Gallery</h2>
      <div className="gallery-grid">
        {gallery.map(item => (
          <img key={item.id} src={item.url} alt="Gallery" className="gallery-image" />
        ))}
      </div>
    </motion.div>
  );
}