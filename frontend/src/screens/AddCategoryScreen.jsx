import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/Sidebar';
import { addCategory, getCategories, deleteCategory } from '../services/api';
import '../styles/AddCategoryScreen.css';

class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <span className="error-text">Something went wrong: {this.state.error?.message || 'Unknown error'}</span>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function AddCategoryScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getCategories();
      console.log('fetchCategories response:', response);
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
        setError(response.message || 'Failed to load categories');
      }
    } catch (err) {
      setCategories([]);
      setError('Error fetching categories');
      console.error('Fetch categories error:', err);
    }
  };

  const pickImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const mimeType = file.type || (file.name.endsWith('.png') ? 'image/png' : 'image/jpeg');
      const reader = new FileReader();
      reader.onload = () => {
        setImage({ uri: reader.result, file, mimeType });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!name) {
      setError('Category name is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);

      if (image && !image.uri.startsWith('http')) {
        console.log('Appending image to FormData:', image.file);
        formData.append('image', image.file);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`FormData entry: ${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`);
      }

      const response = await addCategory(formData);
      console.log('addCategory response:', response);
      if (response.success) {
        alert('Category added');
        setName('');
        setImage(null);
        setError('');
        fetchCategories();
      } else {
        setError(response.message || 'Failed to add category');
      }
    } catch (err) {
      setError('Error adding category: ' + err.message);
      console.error('Submit error:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteCategory(id);
      if (response.success) {
        alert('Category deleted');
        fetchCategories();
      } else {
        setError(response.message || 'Failed to delete category');
      }
    } catch (err) {
      setError('Error deleting category');
      console.error('Delete error:', err);
    }
  };

  return (
    <ErrorBoundary>
      <motion.div
        className="add-category-container"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AdminHeader />
        <div className="main-content">
          <Sidebar />
          <motion.div
            className="content"
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h2 className="title">Add Category</h2>
            {error && <span className="error-text">{error}</span>}

            <div className="form-container">
              <input
                type="text"
                placeholder="Category Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
              <label htmlFor="image-upload" className="upload-button">
                {image ? 'Change Image' : 'Upload Image'}
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={pickImage}
                  style={{ display: 'none' }}
                />
              </label>
              {image && <img src={image.uri} alt="Preview" className="preview-image" />}
              <button onClick={handleSubmit} className="submit-button">
                Add Category
              </button>
            </div>

            <div className="existing-items">
              <h3 className="subtitle">Existing Categories</h3>
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((cat) => (
                  <motion.div
                    key={cat._id}
                    className="existing-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="item-details">
                      <div className="item-row">
                        {cat.imageUrl && <img src={cat.imageUrl} alt={cat.name} className="item-image" />}
                        <span className="item-title">{cat.name}</span>
                      </div>
                    </div>
                    <div className="item-actions">
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="delete-button"
                      >
                        <i className="fas fa-trash" style={{ color: '#FF4D4D' }}></i>
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <span className="no-items-text">No categories available</span>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
}