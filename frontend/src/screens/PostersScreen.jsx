import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import AdminHeader from '../components/AdminHeader';
import Sidebar from '../components/Sidebar';
import { addPoster, getPosters, updatePoster, deletePoster } from '../services/api';
import '../styles/PostersScreen.css';

export default function PostersScreen() {
  const navigate = useNavigate();
  const [posterLink, setPosterLink] = useState('');
  const [posters, setPosters] = useState([]);
  const [editingPoster, setEditingPoster] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    try {
      const response = await getPosters();
      if (response.success && Array.isArray(response.data)) {
        setPosters(response.data);
      } else {
        setPosters([]);
        setError(response.message || 'Failed to load posters');
      }
    } catch (err) {
      setPosters([]);
      setError('Error fetching posters');
      console.error('Fetch posters error:', err);
    }
  };

  const handleSubmit = async () => {
    if (!posterLink || !/^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/.test(posterLink)) {
      setError('Please enter a valid image URL');
      return;
    }

    try {
      let response;
      if (editingPoster) {
        response = await updatePoster(editingPoster._id, { link: posterLink });
      } else {
        response = await addPoster({ link: posterLink });
      }
      if (response.success) {
        alert(editingPoster ? 'Poster updated' : 'Poster added');
        setPosterLink('');
        setEditingPoster(null);
        setError('');
        fetchPosters();
      } else {
        setError(response.message || 'Failed to save poster');
      }
    } catch (err) {
      setError('Error saving poster');
      console.error('Submit error:', err);
    }
  };

  const handleEdit = (poster) => {
    setEditingPoster(poster);
    setPosterLink(poster.link);
  };

  const handleDelete = async (id) => {
    try {
      const response = await deletePoster(id);
      if (response.success) {
        alert('Poster deleted');
        fetchPosters();
      } else {
        setError(response.message || 'Failed to delete poster');
      }
    } catch (err) {
      setError('Error deleting poster');
      console.error('Delete error:', err);
    }
  };

  return (
    <motion.div
      className="posters-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AdminHeader />
      <div className="main-layout">
        <Sidebar />
        <div className="poster-content">
          <h2>Manage Posters</h2>
          {error && <p className="error">{error}</p>}

          <div className="poster-form">
            <input
              type="text"
              placeholder="Enter Poster Image URL"
              value={posterLink}
              onChange={(e) => setPosterLink(e.target.value)}
            />
            <button onClick={handleSubmit}>
              {editingPoster ? 'Update Poster' : 'Add Poster'}
            </button>
          </div>

          <div className="poster-list">
            {posters.map((poster) => (
              <div key={poster._id} className="poster-card">
                <img src={poster.link} alt="Poster" />
                <div className="card-buttons">
                  <button onClick={() => handleEdit(poster)}>Edit</button>
                  <button onClick={() => handleDelete(poster._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
