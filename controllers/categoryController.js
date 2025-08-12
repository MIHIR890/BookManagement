const CategoryCollection = require('../models/categoryModel');

// Function to generate unique category ID
async function generateUniqueId() {
  const lastCategory = await CategoryCollection.findOne().sort({ id: -1 }).limit(1);
  return lastCategory ? lastCategory.id + 1 : 1; // Start from 1 if no categories exist
}

// Add a new category
async function addCategory(req, res) {
  try {
    const { name } = req.body;

    // Validate input
    if (!name) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check for duplicate category name
    const existingCategory = await CategoryCollection.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already added' });
    }

    // Generate unique ID
    const id = await generateUniqueId();

    // Save new category
    const newCategory = new CategoryCollection({ name, id });
    await newCategory.save();

    res.status(201).json({
      message: 'Category is created',
      data: { id: newCategory.id, name: newCategory.name },
    });
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Get all categories
async function getCategoryList(req, res) {
  try {
    const categories = await CategoryCollection.find();

    if (categories.length === 0) {
      return res.status(404).json({
        message: 'No categories found',
        data: [],
      });
    }

    res.status(200).json({
      status: 'S',
      message: 'Category List is fetched',
      data: categories,
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  addCategory,
  getCategoryList,
};
