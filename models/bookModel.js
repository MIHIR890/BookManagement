const mongoose = require('mongoose');

const BookScheme = new mongoose.Schema({
    bookId : {
        type: String,

    },
    categoryId: {
        type: Number,
        require: true
    },

    bookName: {
        type: String,
        require: true
    },
    authorName: {
        type: String,
        require: true
    },
    coverImage: {
        type: String,
        require: false
    }
});
const BookCollection =  mongoose.model('Books', BookScheme);

module.exports = BookCollection;