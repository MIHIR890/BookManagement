const express = require('express');
const router = express.Router();
const { getBookList } = require('../controllers/bookController')
const  { addBooks} = require('../controllers/bookController');
console.log(typeof getBookList);
const authenticateToken = require('../controllers/authenticatetoken'); // Import middleware


// Route to add a category
router.post('/addBooks', authenticateToken, addBooks);
router.get('/getBookList',authenticateToken, getBookList )


// Route to fetch all categories

module.exports = router;