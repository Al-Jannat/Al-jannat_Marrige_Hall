const mongoose = require('mongoose');

const posterSchema = new mongoose.Schema({
  link: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Poster', posterSchema);