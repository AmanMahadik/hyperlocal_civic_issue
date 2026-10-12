const Issue = require('../models/Issue');

/**
 * Searches for active/open issues of the same category within radius meters
 * @param {Object} options
 * @param {number} options.lng
 * @param {number} options.lat
 * @param {string} options.categoryId
 * @param {number} [options.maxDistanceMeters=50]
 * @returns {Promise<Array>} List of potential duplicate issues
 */
const findNearbyDuplicates = async ({ lng, lat, categoryId, maxDistanceMeters = 50 }) => {
  const query = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        },
        $maxDistance: maxDistanceMeters
      }
    },
    status: {
      $in: ['pending', 'verified', 'assigned', 'in_progress']
    }
  };

  if (categoryId) {
    query.category = categoryId;
  }

  return await Issue.find(query)
    .populate('category', 'name code icon')
    .populate('ward', 'name number')
    .limit(5);
};

module.exports = {
  findNearbyDuplicates
};
