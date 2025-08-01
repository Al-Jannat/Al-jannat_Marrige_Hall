import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/Sidebar';
import { addDish, getDishes, updateDish, deleteDish, getCategories } from '../services/api';
import '../styles/AddDishScreen.css';

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

export default function AddDishScreen() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [editingDish, setEditingDish] = useState(null);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchDishes();
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

  const fetchDishes = async () => {
    try {
      const response = await getDishes();
      console.log('fetchDishes response:', response);
      if (response.success && Array.isArray(response.data)) {
        setDishes(response.data);
      } else {
        setDishes([]);
        setError(response.message || 'Failed to load dishes');
      }
    } catch (err) {
      setDishes([]);
      setError('Error fetching dishes');
      console.error('Fetch dishes error:', err);
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
    if (!name || !price || !description || !category) {
      setError('Please fill all fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('price', price);
      formData.append('description', description);
      formData.append('category', category);

      if (image && !image.uri.startsWith('http')) {
        console.log('Appending image to FormData:', image.file);
        formData.append('image', image.file);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`FormData entry: ${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`);
      }

      const response = editingDish
        ? await updateDish(editingDish._id, formData)
        : await addDish(formData);

      console.log('API response:', response);
      if (response.success) {
        alert(editingDish ? 'Dish updated' : 'Dish added');
        resetForm();
        fetchDishes();
      } else {
        setError(response.message || 'Failed to save dish');
      }
    } catch (err) {
      setError('Error saving dish');
      console.error('Submit error:', err.message, err.stack);
    }
  };

  const resetForm = () => {
    setName('');
    setPrice('');
    setDescription('');
    setCategory('');
    setImage(null);
    setEditingDish(null);
    setError('');
    setModalVisible(false);
  };

  const handleEdit = (dish) => {
    setEditingDish(dish);
    setName(dish.name);
    setPrice(dish.price.toString());
    setDescription(dish.description);
    setCategory(dish.category._id);
    setImage(dish.imageUrl ? { uri: dish.imageUrl, mimeType: 'image/jpeg' } : null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteDish(id);
      if (response.success) {
        alert('Dish deleted');
        fetchDishes();
      } else {
        setError(response.message || 'Failed to delete dish');
      }
    } catch (err) {
      setError('Error deleting dish');
      console.error('Delete error:', err);
    }
  };

  const selectedCategory = categories.find((cat) => cat._id === category);

  return (
    <ErrorBoundary>
      <motion.div
        className="add-dish-container"
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
            <h2 className="title">{editingDish ? 'Edit Dish' : 'Add Dish'}</h2>
            {error && <span className="error-text">{error}</span>}

            <div className="form-container">
              <input
                type="text"
                placeholder="Dish Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input textarea"
                rows="4"
              />
              <div className="category-picker" onClick={() => setModalVisible(true)}>
                <div className="category-picker-content">
                  {selectedCategory ? (
                    <div className="category-picker-item">
                      {selectedCategory.imageUrl && (
                        <img src={selectedCategory.imageUrl} alt={selectedCategory.name} className="category-icon" />
                      )}
                      <span className="category-picker-text">{selectedCategory.name}</span>
                    </div>
                  ) : (
                    <span className="category-picker-text">Select Category</span>
                  )}
                </div>
              </div>
              {modalVisible && (
                <motion.div
                  className="modal-container"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="modal-content">
                    <div className="modal-scroll">
                      {categories.map((cat) => (
                        <motion.div
                          key={cat._id}
                          className="modal-item"
                          onClick={() => {
                            setCategory(cat._id);
                            setModalVisible(false);
                          }}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <div className="modal-item-content">
                            {cat.imageUrl && (
                              <img src={cat.imageUrl} alt={cat.name} className="category-icon" />
                            )}
                            <span className="modal-item-text">{cat.name}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                    <button
                      onClick={() => setModalVisible(false)}
                      className="modal-close-button"
                    >
                      Close
                    </button>
                  </div>
                </motion.div>
              )}
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
              <button
                onClick={handleSubmit}
                className="submit-button"
              >
                {editingDish ? 'Update Dish' : 'Add Dish'}
              </button>
            </div>

            <div className="existing-items">
              <h3 className="subtitle">Existing Dishes</h3>
              {Array.isArray(dishes) && dishes.length > 0 ? (
                dishes.map((dish) => (
                  <motion.div
                    key={dish._id}
                    className="existing-item"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="item-details">
                      <span className="item-title">{dish.name}</span>
                      <span className="item-price">${dish.price}</span>
                      <span className="item-point">{dish.description}</span>
                      <span className="item-point">Category: {dish.category?.name || 'None'}</span>
                    </div>
                    {dish.imageUrl && <img src={dish.imageUrl} alt={dish.name} className="item-image" />}
                    <div className="item-actions">
                      <button
                        onClick={() => handleEdit(dish)}
                        className="edit-button"
                      >
                        <i className="fas fa-pencil" style={{ color: '#ffd700' }}></i>
                      </button>
                      <button
                        onClick={() => handleDelete(dish._id)}
                        className="delete-button"
                      >
                        <i className="fas fa-trash" style={{ color: '#ff4d4d' }}></i>
                      </button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <span className="no-items-text">No dishes available</span>
              )}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </ErrorBoundary>
  );
}