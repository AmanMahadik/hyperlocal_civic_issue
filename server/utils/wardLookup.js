const Ward = require('../models/Ward');

/**
 * Looks up the PCMC Ward for given [lng, lat] point coordinates.
 * @param {Array<number>} coordinates - [longitude, latitude]
 * @returns {Promise<Object|null>} Ward document or null if outside PCMC
 */
const findWardByCoordinates = async (coordinates) => {
  const [lng, lat] = coordinates;

  try {
    // 1. Try exact point-in-polygon lookup using 2dsphere $geoIntersects
    const ward = await Ward.findOne({
      boundary: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [lng, lat]
          }
        }
      }
    });

    if (ward) return ward;

    // 2. PCMC general bounding box check:
    // Approx PCMC coordinates: Longitude 73.74 to 73.95, Latitude 18.57 to 18.73
    const isWithinPcmcBounds =
      lng >= 73.72 && lng <= 73.96 && lat >= 18.56 && lat <= 18.75;

    if (isWithinPcmcBounds) {
      // Find the nearest ward by polygon center / any ward if boundaries have minor gaps
      const defaultWard = await Ward.findOne().sort({ number: 1 });
      return defaultWard;
    }

    return null;
  } catch (err) {
    console.error('Error finding ward by coordinates:', err.message);
    return null;
  }
};

module.exports = {
  findWardByCoordinates
};
