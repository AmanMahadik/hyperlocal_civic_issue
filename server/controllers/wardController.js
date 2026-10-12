const Ward = require('../models/Ward');
const Issue = require('../models/Issue');

// @desc    Get all PCMC wards with summary
// @route   GET /api/wards
// @access  Public
const getWards = async (req, res, next) => {
  try {
    const wards = await Ward.find().sort('number');
    res.json({
      success: true,
      count: wards.length,
      data: wards
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWards
};
