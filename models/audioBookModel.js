const mongoose = require('mongoose');

const AudiobookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String, required: true },
  audioUrl: { type: String, required: true },
  coverImage: { type: String, required: false },
  duration: { type: Number, required: false }, // Duration in seconds
});

const AudioBook = mongoose.model('Audiobook', AudiobookSchema);
 module.exports = { AudioBook };