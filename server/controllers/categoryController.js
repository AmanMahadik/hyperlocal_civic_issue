const Category = require('../models/Category');

// @desc    Get all active civic issue categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort('name');
    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a category
// @route   POST /api/categories
// @access  Private (Superadmin)
const createCategory = async (req, res, next) => {
  try {
    const { code, name, defaultPriority, slaDays, department, icon } = req.body;

    const category = await Category.create({
      code,
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      defaultPriority: defaultPriority || 'medium',
      slaDays: slaDays || 3,
      department,
      icon: icon || 'AlertCircle'
    });

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  createCategory
};
