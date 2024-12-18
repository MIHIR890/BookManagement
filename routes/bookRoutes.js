const express = require('express');
const router = express.Router();
const { getBookList } = require('../controllers/bookController')
const  { addBooks} = require('../controllers/bookController');
console.log(typeof getBookList);

// Route to add a category
router.post('/addBooks', addBooks);
router.get('/getBookList', getBookList )


// Route to fetch all categories

module.exports = router;