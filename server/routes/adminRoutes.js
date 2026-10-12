const express = require('express');
const router = express.Router();
const {
  getVerificationQueue,
  getDashboardStats
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.get('/queue', protect, authorize('admin', 'superadmin'), getVerificationQueue);
router.get('/stats', protect, authorize('admin', 'superadmin'), getDashboardStats);

module.exports = router;
