const mongoose = require('mongoose');

const ReadingHistorySchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  pagesRead: {
    type: Number,
    required: true
  }
});
//new

const BookSchema = new mongoose.Schema({
  bookId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  currentPage: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['Reading', 'Completed', 'Not Started'],
    required: true
  },
  readingHistory: {
    type: [ReadingHistorySchema],
    default: []
  }
});

const ReadingDataSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    unique: true
  },
  books: {
    type: [BookSchema],
    default: []
  }
});

const ReadingData = mongoose.model('ReadingData', ReadingDataSchema);

module.exports = ReadingData;
