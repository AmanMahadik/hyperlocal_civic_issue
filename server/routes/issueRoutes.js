const express = require('express');
const router = express.Router();
const {
  createIssue,
  getIssues,
  getNearbyIssues,
  getMyIssues,
  getIssueById,
  upvoteIssue,
  confirmResolution,
  addComment,
  getComments
} = require('../controllers/issueController');
const {
  verifyIssue,
  rejectIssue,
  assignIssue,
  updateStatus
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Base collection routes
router.route('/')
  .get(getIssues)
  .post(protect, upload.array('images', 3), createIssue);

// Sub-resource special queries
router.get('/nearby', getNearbyIssues);
router.get('/mine', protect, getMyIssues);

// Single issue detail
router.get('/:id', getIssueById);

// Citizen interactions
router.post('/:id/upvote', protect, upvoteIssue);
router.post('/:id/confirm', protect, confirmResolution);
router.route('/:id/comments')
  .get(getComments)
  .post(protect, addComment);

// Admin workflow actions
router.patch('/:id/verify', protect, authorize('admin', 'superadmin'), verifyIssue);
router.patch('/:id/reject', protect, authorize('admin', 'superadmin'), rejectIssue);
router.patch('/:id/assign', protect, authorize('admin', 'superadmin'), assignIssue);
router.patch(
  '/:id/status',
  protect,
  authorize('admin', 'superadmin'),
  upload.array('resolutionImages', 3),
  updateStatus
);

module.exports = router;
