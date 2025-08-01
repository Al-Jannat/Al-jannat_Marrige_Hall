import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Particles from '@tsparticles/react';
import { loadFull } from 'tsparticles';
import HeaderRow from '../components/HeaderRow';
import { getMenuItems, getDishes, getCategories } from '../services/api';
import '../styles/MenuScreen.css';

const MenuScreen = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [loadingDishes, setLoadingDishes] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [error, setError] = useState(null);

  const serviceCategories = [
    { name: 'Venue', icon: 'fas fa-church', path: '/category-images/Venue' },
    { name: 'Locate Us', icon: 'fas fa-map-marker-alt', path: '/contact' },
    { name: 'Events', icon: 'fas fa-calendar-alt', path: '/category-images/Events' },
    { name: 'Catering', icon: 'fas fa-utensils', path: '/category-images/Catering' },
    { name: 'Our Dishes', icon: 'fas fa-book', path: '/menu' },
    { name: 'Ceremonies', icon: 'fas fa-ring', path: '/category-images/Ceremonies' },
  ];

  const particlesInit = async (engine) => {
    await loadFull(engine);
  };

  const particlesOptions = {
    particles: {
      number: { value: 25, density: { enable: true, value_area: 1000 } },
      color: { value: '#E8B923' }, // Soft Gold
      shape: { type: 'circle' },
      opacity: { value: 0.25, random: true },
      size: { value: 2, random: true },
      move: { enable: true, speed: 0.4, direction: 'none', random: true, out_mode: 'out' },
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'repulse' }, onclick: { enable: true, mode: 'push' } },
      modes: { repulse: { distance: 150 }, push: { particles_nb: 2 } },
    },
  };

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setLoadingMenus(true);
        setError(null);
        const response = await getMenuItems();
        if (response.success && Array.isArray(response.data)) {
          setMenuItems(response.data);
        } else {
          setMenuItems([]);
          setError('No menu items found');
        }
      } catch (error) {
        console.error('Fetch menu items error:', error);
        setMenuItems([]);
        setError('Failed to fetch menu items');
      } finally {
        setLoadingMenus(false);
      }
    };

    const fetchDishes = async () => {
      try {
        setLoadingDishes(true);
        setError(null);
        const response = await getDishes();
        if (response.success && Array.isArray(response.data)) {
          setDishes(response.data);
          console.log('Fetched dishes:', response.data);
        } else {
          setDishes([]);
          setError('No dishes found');
        }
      } catch (error) {
        console.error('Fetch dishes error:', error);
        setDishes([]);
        setError('Failed to fetch dishes');
      } finally {
        setLoadingDishes(false);
      }
    };

    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getCategories();
        if (response.success && Array.isArray(response.data)) {
          setCategories([{ _id: 'all', name: 'All' }, ...response.data]);
          console.log('Fetched categories:', response.data);
        } else {
          setCategories([{ _id: 'all', name: 'All' }]);
        }
      } catch (error) {
        console.error('Fetch categories error:', error);
        setCategories([{ _id: 'all', name: 'All' }]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchMenus();
    fetchDishes();
    fetchCategories();
  }, []);

  const handleCategoryChange = (category) => {
    console.log('Category clicked:', category);
    setSelectedCategory(category);
    console.log('Selected category updated to:', category);
    console.log('Filtered dishes:', dishes.filter((dish) => dish.category?.name?.toLowerCase() === category.toLowerCase()));
  };

  const filteredDishes = selectedCategory === 'All'
    ? dishes
    : dishes.filter((dish) => dish.category?.name?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <motion.div
      className="menu-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      <div className="particles-container">
        <Particles id="tsparticles" init={particlesInit} options={particlesOptions} />
      </div>
      <HeaderRow />
      <div className="scroll-container">
        <div className="scroll-content">
          <motion.div
            className="category-section"
            initial={{ scale: 0.8, opacity: 0, boxShadow: '0 0 0 rgba(152, 215, 194, 0)' }}
            animate={{ scale: 1, opacity: 1, boxShadow: '0 0 20px rgba(152, 215, 194, 0.5)' }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 120, damping: 15 }}
          >
            <div className="category-list">
              {serviceCategories.map((item) => (
                <motion.button
                  key={item.name}
                  className="category-card"
                  onClick={() => navigate(item.path)}
                  whileHover={{ scale: 1.05, rotate: 2, boxShadow: '0 0 15px rgba(152, 215, 194, 0.7)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <i className={`${item.icon} category-icon`} />
                  <span className="category-text">{item.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
          <motion.div
            className="menu-section"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 120, damping: 15 }}
          >
            <h2 className="section-title">Our Menus</h2>
            {loadingMenus ? (
              <motion.p
                className="loading-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Loading menus...
              </motion.p>
            ) : error && menuItems.length === 0 ? (
              <motion.p
                className="error-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {error}
              </motion.p>
            ) : menuItems.length > 0 ? (
              <div className="menu-list">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item._id}
                    className="menu-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ scale: 1.03, rotate: 2, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
                  >
                    {item.imageUrl && (
                      <img
                        className="menu-image"
                        src={item.imageUrl}
                        alt={item.title}
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/200x200?text=Menu')}
                      />
                    )}
                    <h3 className="menu-name">{item.title}</h3>
                    <ul className="menu-description">
                      {item.points && item.points.length > 0 ? (
                        item.points.map((point, idx) => (
                          <li key={idx} className="menu-description-item">{point}</li>
                        ))
                      ) : (
                        <li className="menu-description-item">No details available</li>
                      )}
                    </ul>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p
                className="no-items-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                No menu items available
              </motion.p>
            )}
          </motion.div>
          <motion.div
            className="dish-section"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, type: 'spring', stiffness: 120, damping: 15, delay: 0.2 }}
          >
            <h2 className="section-title">Our Dishes</h2>
            {loadingCategories ? (
              <motion.p
                className="loading-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Loading categories...
              </motion.p>
            ) : (
              <div className="filter-container" style={{ position: 'relative', zIndex: 1 }}>
                {categories.map((category) => (
                  <motion.button
                    key={category._id}
                    className={`filter-button ${selectedCategory === category.name ? 'active' : ''}`}
                    onClick={() => handleCategoryChange(category.name)}
                    whileHover={{ scale: 1.05, boxShadow: '0 5px 15px rgba(152, 215, 194, 0.5)' }}
                    whileTap={{ scale: 0.95 }}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                  >
                    {category.name}
                  </motion.button>
                ))}
              </div>
            )}
            {loadingDishes ? (
              <motion.p
                className="loading-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                Loading dishes...
              </motion.p>
            ) : error && filteredDishes.length === 0 ? (
              <motion.p
                className="error-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {error}
              </motion.p>
            ) : filteredDishes.length > 0 ? (
              <div className="dish-list">
                {filteredDishes.map((item, index) => (
                  <motion.div
                    key={item._id}
                    className="dish-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    whileHover={{ scale: 1.03, rotate: 2, boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)' }}
                  >
                    {item.imageUrl && (
                      <img
                        className="dish-image"
                        src={item.imageUrl}
                        alt={item.name}
                        onError={(e) => (e.target.src = 'https://via.placeholder.com/200x200?text=Dish')}
                      />
                    )}
                    <h3 className="dish-name">{item.name}</h3>
                    <p className="dish-description">{item.description || 'No description available'}</p>
                 
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.p
                className="no-items-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1}}
                transition={{ duration: 0.5 }}
              >
                No dishes available
              </motion.p>
            )}
          </motion.div>
          
          <motion.button
            className="book-now-button"
            whileHover={{ scale: 1.1, boxShadow: '0 10px 20px rgba(152, 215, 194, 0.5)' }}
            whileTap={{ scale: 0.9 }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 15 }}
            onClick={() => navigate('/contact')}
          >
            Book Now
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuScreen;