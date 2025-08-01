const express = require('express');
const router = express.Router();
const Poster = require('../models/Poster');

router.get('/', async (req, res) => {
  try {
    console.log('GET /posters - Fetching posters');
    const posters = await Poster.find().sort({ createdAt: -1 });
    res.json({ success: true, data: posters });
  } catch (error) {
    console.error('GET /posters error:', error);
    res.status(500).json({ success: false, message: 'Error fetching posters' });
  }
});

router.post('/add', async (req, res) => {
  try {
    console.log('POST /posters/add - Received:', req.body);
    const { link } = req.body;
    if (!link || !/^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/.test(link)) {
      return res.status(400).json({ success: false, message: 'Valid image URL required' });
    }

    const poster = new Poster({ link });
    const savedPoster = await poster.save();
    console.log('Saved poster:', savedPoster);
    res.json({ success: true, data: savedPoster });
  } catch (error) {
    console.error('POST /posters/add error:', error);
    res.status(500).json({ success: false, message: `Error adding poster: ${error.message}` });
  }
});

router.put('/:id', async (req, res) => {
  try {
    console.log('PUT /posters/:id - Received:', { id: req.params.id, ...req.body });
    const { link } = req.body;
    if (!link || !/^https?:\/\/.*\.(?:png|jpg|jpeg|gif)$/.test(link)) {
      return res.status(400).json({ success: false, message: 'Valid image URL required' });
    }

    const poster = await Poster.findByIdAndUpdate(
      req.params.id,
      { link, createdAt: Date.now() },
      { new: true }
    );
    if (!poster) {
      return res.status(404).json({ success: false, message: 'Poster not found' });
    }
    console.log('Updated poster:', poster);
    res.json({ success: true, data: poster });
  } catch (error) {
    console.error('PUT /posters/:id error:', error);
    res.status(500).json({ success: false, message: 'Error updating poster' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    console.log('DELETE /posters/:id - Received:', { id: req.params.id });
    const poster = await Poster.findByIdAndDelete(req.params.id);
    if (!poster) {
      return res.status(404).json({ success: false, message: 'Poster not found' });
    }
    console.log('Deleted poster:', req.params.id);
    res.json({ success: true, message: 'Poster deleted' });
  } catch (error) {
    console.error('DELETE /posters/:id error:', error);
    res.status(500).json({ success: false, message: 'Error deleting poster' });
  }
});

module.exports = router;