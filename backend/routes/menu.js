const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { Readable } = require('stream');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/list', async (req, res) => {
  try {
    const items = await MenuItem.find();
    console.log('GET /menu/list - Retrieved items:', items);
    res.json({ success: true, data: items });
  } catch (error) {
    console.error('GET /menu/list error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    console.log('POST /menu/add - Received:', {
      title: req.body.title,
      price: req.body.price,
      points: req.body.points,
      file: req.file,
    });

    const { title, price, points } = req.body;
    if (!title || !price) {
      return res.status(400).json({ success: false, message: 'Title and price are required' });
    }

    let imageUrl, publicId;
    if (req.file) {
      console.log('Uploading image to Cloudinary:', req.file);
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', upload_preset: '' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        Readable.from(req.file.buffer).pipe(stream);
      });
      console.log('Cloudinary upload result:', result);
      imageUrl = result.secure_url;
      publicId = result.public_id;
    } else {
      console.log('No image file received');
    }

    const menuItem = new MenuItem({
      title,
      price: parseFloat(price),
      points: Array.isArray(points) ? points : points ? [points] : [],
      imageUrl,
      publicId,
    });

    const savedItem = await menuItem.save();
    console.log('Saved menu item:', savedItem);
    res.json({ success: true, data: savedItem });
  } catch (error) {
    console.error('POST /menu/add error:', error.message, error.stack);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

router.put('/edit/:id', upload.single('image'), async (req, res) => {
  try {
    console.log('PUT /menu/edit/:id - Received:', {
      id: req.params.id,
      title: req.body.title,
      price: req.body.price,
      points: req.body.points,
      file: req.file,
    });

    const { title, price, points } = req.body;
    const updateData = {
      title,
      price: parseFloat(price),
      points: Array.isArray(points) ? points : points ? [points] : [],
    };

    if (req.file) {
      console.log('Uploading image to Cloudinary:', req.file);
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', upload_preset: '' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        Readable.from(req.file.buffer).pipe(stream);
      });
      console.log('Cloudinary upload result:', result);
      updateData.imageUrl = result.secure_url;
      updateData.publicId = result.public_id;
    }

    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    console.log('Updated menu item:', updatedItem);
    res.json({ success: true, data: updatedItem });
  } catch (error) {
    console.error('PUT /menu/edit/:id error:', error.message, error.stack);
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

router.delete('/delete/:id', async (req, res) => {
  try {
    console.log('DELETE /menu/delete/:id - ID:', req.params.id);
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
    console.log('Deleted menu item:', deletedItem);
    res.json({ success: true, message: 'Item deleted' });
  } catch (error) {
    console.error('DELETE /menu/delete/:id error:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;