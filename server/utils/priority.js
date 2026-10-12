/**
 * Re-evaluates priority based on upvote count and default priority
 * @param {string} currentPriority - Current priority
 * @param {number} upvoteCount - Number of upvotes
 * @returns {string} Evaluated priority
 */
const calculateDynamicPriority = (currentPriority, upvoteCount) => {
  if (upvoteCount >= 15) {
    return 'critical';
  } else if (upvoteCount >= 5) {
    if (currentPriority === 'low') return 'medium';
    if (currentPriority === 'medium') return 'high';
  }
  return currentPriority;
};

module.exports = {
  calculateDynamicPriority
};
