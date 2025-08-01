import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/Sidebar';
import { addMenuItem, getMenuItems, updateMenuItem, deleteMenuItem } from '../services/api';
import '../styles/EditMenuScreen.css';

export default function EditMenuScreen() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [points, setPoints] = useState(['']);
  const [image, setImage] = useState(null);
  const [publicId, setPublicId] = useState('');
  const [existingItems, setExistingItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const response = await getMenuItems();
      console.log('fetchMenuItems response:', response);
      if (response.success && Array.isArray(response.data)) {
        setExistingItems(response.data);
      } else {
        setExistingItems([]);
        setError(response.message || 'Failed to load menu items');
      }
    } catch (err) {
      setExistingItems([]);
      setError('Error fetching menu items');
      console.error('Fetch error:', err);
    }
  };

  const handleAddPoint = () => {
    setPoints([...points, '']);
  };

  const handleRemovePoint = (index) => {
    if (points.length > 1) {
      setPoints(points.filter((_, i) => i !== index));
    }
  };

  const handlePointChange = (index, value) => {
    const updatedPoints = [...points];
    updatedPoints[index] = value;
    setPoints(updatedPoints);
  };

  const pickImage = (e) => {
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
    if (!title || !price || points.some((point) => !point)) {
      setError('Please fill all fields');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      points.forEach((point, index) => {
        if (point) formData.append(`points[${index}]`, point);
      });

      if (image && !image.uri.startsWith('http')) {
        console.log('Appending image to FormData:', image.file);
        formData.append('image', image.file);
      }

      for (let [key, value] of formData.entries()) {
        console.log(`FormData entry: ${key}=${typeof value === 'object' ? JSON.stringify(value) : value}`);
      }

      const response = editingItem
        ? await updateMenuItem(editingItem._id, formData)
        : await addMenuItem(formData);

      console.log('API response:', response);
      if (response.success) {
        alert(editingItem ? 'Item updated' : 'Item added');
        resetForm();
        fetchMenuItems();
      } else {
        setError(response.message || 'Failed to save item');
      }
    } catch (err) {
      setError('Error saving item');
      console.error('Submit error:', err.message, err.stack);
    }
  };

  const resetForm = () => {
    setTitle('');
    setPrice('');
    setPoints(['']);
    setImage(null);
    setPublicId('');
    setEditingItem(null);
    setError('');
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title);
    setPrice(item.price.toString());
    setPoints(item.points.length ? item.points : ['']);
    setImage(item.imageUrl ? { uri: item.imageUrl, mimeType: 'image/jpeg' } : null);
    setPublicId(item.publicId || '');
  };

  const handleDelete = async (id) => {
    try {
      const response = await deleteMenuItem(id);
      if (response.success) {
        alert('Item deleted');
        fetchMenuItems();
      } else {
        setError(response.message || 'Failed to delete item');
      }
    } catch (err) {
      setError('Error deleting item');
      console.error('Delete error:', err);
    }
  };

  return (
    <motion.div
      className="edit-menu-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AdminHeader />
      <div className="main-content">
        <Sidebar />
        <div className="content">
          <h2 className="title">Edit Menu</h2>
          {error && <span className="error-text">{error}</span>}

          <div className="form-container">
            <input
              type="text"
              placeholder="Title (e.g., Beef Deal)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
            />
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input"
            />
            {points.map((point, index) => (
              <div key={index} className="point-container">
                <input
                  type="text"
                  placeholder={`Description Point ${index + 1} (e.g., Chicken)`}
                  value={point}
                  onChange={(e) => handlePointChange(index, e.target.value)}
                  className="input"
                />
                {points.length > 1 && (
                  <button
                    onClick={() => handleRemovePoint(index)}
                    className="remove-button"
                  >
                    <i className="fas fa-minus" style={{ color: '#FF4D4D' }}></i>
                  </button>
                )}
              </div>
            ))}
            <button onClick={handleAddPoint} className="add-button">
              <i className="fas fa-plus" style={{ color: '#63B3ED' }}></i>
            </button>
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
              {editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>

          <div className="existing-items">
            <h3 className="subtitle">Existing Menu Items</h3>
            {Array.isArray(existingItems) && existingItems.length > 0 ? (
              existingItems.map((item) => (
                <div key={item._id} className="existing-item">
                  <div className="item-details">
                    <span className="item-title">{item.title}</span>
                    <span className="item-price">${item.price}</span>
                    {item.points.map((point, index) => (
                      <span key={index} className="item-point">• {point}</span>
                    ))}
                  </div>
                  {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="item-image" />}
                  <div className="item-actions">
                    <button
                      onClick={() => handleEdit(item)}
                      className="edit-button"
                    >
                      <i className="fas fa-pencil" style={{ color: '#63B3ED' }}></i>
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="delete-button"
                    >
                      <i className="fas fa-trash" style={{ color: '#FF4D4D' }}></i>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <span className="no-items-text">No menu items available</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}