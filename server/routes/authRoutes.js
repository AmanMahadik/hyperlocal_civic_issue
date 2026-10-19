const express = require('express');
const router = express.Router();
const { register, login, getMe, clerkSync } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.post('/clerk-sync', clerkSync);
router.get('/me', protect, getMe);

module.exports = router;
