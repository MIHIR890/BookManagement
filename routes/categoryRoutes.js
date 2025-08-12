const express = require('express');
const router = express.Router();
const { addCategory, getCategoryList } = require('../controllers/categoryController');
const authenticateToken = require('../controllers/authenticatetoken'); // Import middleware


// Route to add a category
router.post('/addCategory', authenticateToken, addCategory);

// Route to fetch all categories
//authentication
// router.get('/getCategoryList',authenticateToken, getCategoryList);
router.get('/getCategoryList', getCategoryList);


module.exports = router;
