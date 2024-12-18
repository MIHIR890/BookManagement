const express = require('express');
const router = express.Router();
const { addtoFavourites } = require('../controllers/favouriteBookController')
const { getfavorite } = require('../controllers/favouriteBookController')
const { removeFavourite } = require('../controllers/favouriteBookController')

// Route to add a category
router.post('/addFavourite', addtoFavourites);
router.post('/getFavourite', getfavorite);
router.post('/removeFavourite', removeFavourite);


// Route to fetch all categories

module.exports = router;