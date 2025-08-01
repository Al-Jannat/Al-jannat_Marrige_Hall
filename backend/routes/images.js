const express = require('express');
const router = express.Router();
const Image = require('../models/Image');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { Readable } = require('stream');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only PNG, JPEG, JPG, and GIF files are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

router.get('/', async (req, res) => {
  try {
    const images = await Image.find().sort({ createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) {
    console.error('Error fetching images:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/add', upload.single('image'), async (req, res) => {
  console.log('Received request:', {
    file: req.file ? { mimetype: req.file.mimetype, originalname: req.file.originalname, size: req.file.size } : null,
    body: req.body,
  });
  const { category } = req.body;
  if (!req.file || !category) {
    return res.status(400).json({ success: false, error: 'Image file and category are required' });
  }
  try {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { format: req.file.mimetype.split('/')[1], resource_type: 'image' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      const bufferStream = new Readable();
      bufferStream.push(req.file.buffer);
      bufferStream.push(null);
      bufferStream.on('error', (error) => {
        console.error('Buffer stream error:', error);
        reject(error);
      });
      stream.on('error', (error) => {
        console.error('Upload stream error:', error);
        reject(error);
      });
      bufferStream.pipe(stream);
    });

    const image = new Image({ link: uploadResult.secure_url, category });
    await image.save();
    console.log('Image saved:', { link: uploadResult.secure_url, category });
    res.json({ success: true, data: image });
  } catch (err) {
    console.error('Error adding image:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, error: 'Image not found' });

    const publicId = image.link.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);
    await Image.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    console.error('Error deleting image:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/category/:category', async (req, res) => {
  try {
    const images = await Image.find({ category: req.params.category }).sort({ createdAt: -1 });
    res.json({ success: true, data: images });
  } catch (err) {
    console.error('Error fetching category images:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/random', async (req, res) => {
  try {
    const count = await Image.countDocuments();
    const randomImages = await Image.aggregate([
      { $sample: { size: Math.min(36, count) } },
    ]);
    res.json({ success: true, data: randomImages });
  } catch (err) {
    console.error('Error fetching random images:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;