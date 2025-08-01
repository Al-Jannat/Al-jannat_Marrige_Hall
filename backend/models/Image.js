const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
  link: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Venue', 'Decor', 'Events', 'Catering', 'Ceremonies', 'Others'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Image', imageSchema);