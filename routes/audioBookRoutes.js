const express = require('express');
const router = express.Router();
const { newAudioBook } = require('../controllers/audioBookController');
const  { getAudioBook} = require('../controllers/audioBookController');
const authenticateToken = require('../controllers/authenticatetoken'); // Import middleware

console.log(typeof getBookList);

// Route to add a category
router.post('/newaudioBook',authenticateToken, newAudioBook);
router.get('/audioBook', authenticateToken,getAudioBook )


// Route to fetch all categories

module.exports = router;