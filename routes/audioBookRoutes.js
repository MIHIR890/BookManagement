const express = require('express');
const router = express.Router();
const { newAudioBook } = require('../controllers/audioBookController');
const  { getAudioBook} = require('../controllers/audioBookController');
console.log(typeof getBookList);

// Route to add a category
router.post('/newaudioBook', newAudioBook);
router.get('/audioBook', getAudioBook )


// Route to fetch all categories

module.exports = router;