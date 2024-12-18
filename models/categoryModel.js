const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt:{
    type : Date,
    defaukt : Date.now
  }
});

const CategoryCollection = mongoose.model('Category', categorySchema);

module.exports = CategoryCollection;
