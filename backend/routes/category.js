const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const Dish = require('../models/Dish');

router.get('/', async (req, res) => {
  try {
    console.log('GET /categories - Fetching categories');
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('GET /categories error:', error);
    res.status(500).json({ success: false, message: 'Error fetching categories' });
  }
});

router.post('/add', upload.single('image'), async (req, res) => {
  try {
    console.log('POST /categories/add - Received:', { ...req.body, file: req.file ? req.file : 'No file uploaded' });
    
    if (!req.body.name) {
      return res.status(400).json({ success: false, message: 'Category name is required' });
    }

    let imageUrl = null;
    let publicId = null;
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: 'image', upload_preset: '', timeout: 60000 },
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

    const category = new Category({
      name: req.body.name,
      imageUrl,
      publicId,
    });

    const savedCategory = await category.save();
    console.log('Saved category:', savedCategory);
    res.json({ success: true, data: savedCategory });
  } catch (error) {
    console.error('POST /categories/add error:', error);
    res.status(500).json({ success: false, message: `Error adding category: ${error.message}` });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    console.log('DELETE /categories/:id - Received:', { id: req.params.id });
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    const dishes = await Dish.find({ category: req.params.id });
    if (dishes.length > 0) {
      return res.status(400).json({ success: false, message: 'Cannot delete category with associated dishes' });
    }

    if (category.publicId) {
      await cloudinary.uploader.destroy(category.publicId);
    }

    await Category.findByIdAndDelete(req.params.id);
    console.log('Deleted category:', req.params.id);
    res.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    console.error('DELETE /categories/:id error:', error);
    res.status(500).json({ success: false, message: 'Error deleting category' });
  }
});

module.exports = router;