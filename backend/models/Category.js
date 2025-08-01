const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  imageUrl: { type: String, required: false },
  publicId: { type: String, required: false },
});

module.exports = mongoose.model('Category', categorySchema);