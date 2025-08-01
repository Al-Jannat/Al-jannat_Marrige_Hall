import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/Sidebar';
import { addImage, getImages, deleteImage } from '../services/api';
import '../styles/HomeImageScreen.css';

export default function HomeImageScreen() {
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const categories = ['Venue', 'Decor', 'Events', 'Catering', 'Ceremonies', 'Others'];

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const response = await getImages();
      if (response.success && Array.isArray(response.data)) {
        setImages(response.data);
      } else {
        setImages([]);
        setError('Failed to load images');
      }
    } catch (err) {
      setImages([]);
      setError('Error fetching images');
    }
  };

  const pickImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const mimeType = file.type || (file.name.endsWith('.png') ? 'image/png' : 'image/jpeg');
      const reader = new FileReader();
      reader.onload = () => {
        setImage({ uri: reader.result, file, mimeType });
        setError('');
      };
      reader.readAsDataURL(file);
    } else {
      setError('Image selection canceled');
    }
  };

  const handleAddImage = async () => {
    if (!image) return setError('Please select an image');
    if (!category) return setError('Please select a category');

    try {
      const formData = new FormData();
      formData.append('image', image.file);
      formData.append('category', category);

      const response = await addImage(formData);
      if (response.success) {
        alert('Image added successfully');
        setImage(null);
        setCategory('');
        setError('');
        fetchImages();
      } else {
        setError(response.error || 'Failed to add image');
        alert(response.error || 'Failed to add image');
      }
    } catch (err) {
      setError('Error adding image: ' + err.message);
      alert('Error adding image: ' + err.message);
    }
  };

  const handleDeleteImage = async (id) => {
    try {
      const response = await deleteImage(id);
      if (response.success) {
        alert('Image deleted successfully');
        fetchImages();
      } else {
        setError(response.error || 'Failed to delete image');
        alert(response.error || 'Failed to delete image');
      }
    } catch (err) {
      setError('Error deleting image');
      alert('Error deleting image');
    }
  };

  return (
    <motion.div
      className="home-image-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <AdminHeader />
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <motion.h2
            className="title"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            📷 Manage Homepage Images
          </motion.h2>

          {error && (
            <motion.div
              className="error-box"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </motion.div>
          )}

          <motion.div
            className="form-wrapper"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <label htmlFor="image-upload" className="upload-btn">
              Upload Image
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={pickImage}
                hidden
              />
            </label>

            {image && (
              <motion.img
                src={image.uri}
                alt="Preview"
                className="image-preview"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            )}

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="category-select"
            >
              <option value="">Select Category</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>{cat}</option>
              ))}
            </select>

            <button onClick={handleAddImage} className="add-btn">
              Add Image
            </button>
          </motion.div>

          <motion.div
            className="image-list"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {images.length > 0 ? (
              <div className="image-grid">
                {images.map((item) => (
                  <motion.div
                    key={item._id}
                    className="image-card"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img src={item.link} alt="Gallery" className="thumb" />
                    <div className="card-info">
                      <span>📁 {item.category}</span>
                      <span className="url-text">{item.link}</span>
                      <button
                        className="delete-btn"
                        onClick={() => handleDeleteImage(item._id)}
                      >
                        ❌ Delete
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="no-images">No images found.</p>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
