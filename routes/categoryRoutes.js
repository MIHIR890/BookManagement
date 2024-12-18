const express = require('express');
const router = express.Router();
const { addCategory, getCategoryList } = require('../controllers/categoryController');

// Route to add a category
router.post('/addCategory', addCategory);

// Route to fetch all categories
router.get('/getCategoryList', getCategoryList);

module.exports = router;
