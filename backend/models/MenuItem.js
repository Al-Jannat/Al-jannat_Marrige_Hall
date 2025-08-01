const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  points: [{ type: String }],
  imageUrl: { type: String },
  publicId: { type: String },
});

module.exports = mongoose.model('MenuItem', menuItemSchema);