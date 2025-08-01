const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const contactController = require('../controllers/contactController');

router.get('/services', async (req, res) => {
  const data = await fs.readFile('./data/services.json', 'utf8');
  res.json(JSON.parse(data));
});

router.get('/gallery', async (req, res) => {
  const data = await fs.readFile('./data/gallery.json', 'utf8');
  res.json(JSON.parse(data));
});

router.get('/pricing', async (req, res) => {
  const data = await fs.readFile('./data/pricing.json', 'utf8');
  res.json(JSON.parse(data));
});

router.post('/contact', contactController.submitContact);

module.exports = router;