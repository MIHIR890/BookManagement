const express = require('express');
const router = express.Router();
const { addtoFavourites } = require('../controllers/favouriteBookController')
const { getfavorite } = require('../controllers/favouriteBookController')
const { removeFavourite } = require('../controllers/favouriteBookController')
const authenticateToken = require('../controllers/authenticatetoken'); // Import middleware


// Route to add a category
router.post('/addFavourite',authenticateToken, addtoFavourites);
router.post('/getFavourite',authenticateToken, getfavorite);
router.post('/removeFavourite', authenticateToken,removeFavourite);


// Route to fetch all categories

module.exports = router;