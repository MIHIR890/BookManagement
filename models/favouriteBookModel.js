const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    bookName: {
        type: String,
        required: true,
    },
    authorName: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
        required: false,
    },
}, {
    timestamps: true, // Optional: adds createdAt/updatedAt fields automatically
});

const FavouriteCollection = mongoose.model('Favourite', favouriteSchema);

module.exports = FavouriteCollection;
