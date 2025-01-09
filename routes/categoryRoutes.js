const express = require('express');
const router = express.Router();
const { addCategory, getCategoryList } = require('../controllers/categoryController');
const authenticateToken = require('../controllers/authenticatetoken'); // Import middleware


// Route to add a category
router.post('/addCategory', authenticateToken, addCategory);

// Route to fetch all categories
router.get('/getCategoryList',authenticateToken, getCategoryList);

module.exports = router;
