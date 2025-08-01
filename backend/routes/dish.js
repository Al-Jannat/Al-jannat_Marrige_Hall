const express = require('express');
const router = express.Router();
const Dish = require('../models/Dish');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    console.log('POST /dishes/add - Received:', { ...req.body, file: req.file });
    
    let imageUrl, publicId;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', upload_preset: '' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      console.log('Cloudinary upload result:', result);
      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    const dish = new Dish({
      ...req.body,
      imageUrl,
      publicId,
    });

    const savedDish = await dish.save();
    console.log('Saved dish:', savedDish);
    res.json({ success: true, data: savedDish });
  } catch (error) {
    console.error('POST /dishes/add error:', error);
    res.status(500).json({ success: false, message: 'Error adding dish' });
  }
});

router.get('/', async (req, res) => {
  try {
    console.log('GET /dishes - Fetching dishes');
    const dishes = await Dish.find().populate('category');
    res.json({ success: true, data: dishes });
  } catch (error) {
    console.error('GET /dishes error:', error);
    res.status(500).json({ success: false, message: 'Error fetching dishes' });
  }
});

router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    console.log('PUT /dishes/:id - Received:', { id: req.params.id, ...req.body, file: req.file });
    
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    let imageUrl = dish.imageUrl;
    let publicId = dish.publicId;

    if (req.file) {
      if (dish.publicId) {
        await cloudinary.uploader.destroy(dish.publicId);
      }
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', upload_preset: '' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      console.log('Cloudinary upload result:', result);
      imageUrl = result.secure_url;
      publicId = result.public_id;
    }

    const updatedDish = await Dish.findByIdAndUpdate(
      req.params.id,
      { ...req.body, imageUrl, publicId },
      { new: true }
    ).populate('category');

    console.log('Updated dish:', updatedDish);
    res.json({ success: true, data: updatedDish });
  } catch (error) {
    console.error('PUT /dishes/:id error:', error);
    res.status(500).json({ success: false, message: 'Error updating dish' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    console.log('DELETE /dishes/:id - Received:', { id: req.params.id });
    const dish = await Dish.findById(req.params.id);
    if (!dish) {
      return res.status(404).json({ success: false, message: 'Dish not found' });
    }

    if (dish.publicId) {
      await cloudinary.uploader.destroy(dish.publicId);
    }

    await Dish.findByIdAndDelete(req.params.id);
    console.log('Deleted dish:', req.params.id);
    res.json({ success: true, message: 'Dish deleted' });
  } catch (error) {
    console.error('DELETE /dishes/:id error:', error);
    res.status(500).json({ success: false, message: 'Error deleting dish' });
  }
});

module.exports = router;