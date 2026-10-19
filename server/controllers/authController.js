const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'pcmc_hyperlocal_civic_issue_super_secret_jwt_key_2026',
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'A user with this email already exists'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Only allow 'citizen' or 'admin' during registration (admin can be restricted or allowed for demo)
    const assignedRole = role === 'admin' ? 'admin' : 'citizen';

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      passwordHash,
      role: assignedRole
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: user.toSafeObject(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: user.toSafeObject(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// Designated admin emails & domain checker
const ADMIN_EMAILS = [
  'admin@pcmc.gov.in',
  'mahadik.aman8@gmail.com',
  'amanmahadik8@gmail.com'
];

const checkIsAdmin = (email = '') => {
  const normalized = (email || '').toLowerCase().trim();
  return normalized.endsWith('@pcmc.gov.in') || ADMIN_EMAILS.includes(normalized);
};

// @desc    Sync or provision user from Clerk session
// @route   POST /api/auth/clerk-sync
// @access  Public
const clerkSync = async (req, res, next) => {
  try {
    const { clerkId, email, name, phone, role } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required from Clerk'
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    const shouldBeAdmin = checkIsAdmin(normalizedEmail) || role === 'admin';

    if (!user) {
      // Auto-create user linked from Clerk
      const randomPassword = Math.random().toString(36).slice(-10) + '!A1';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(randomPassword, salt);

      user = await User.create({
        name: name || normalizedEmail.split('@')[0],
        email: normalizedEmail,
        phone: phone || '',
        passwordHash,
        role: shouldBeAdmin ? 'admin' : 'citizen',
        isActive: true
      });
    } else if (shouldBeAdmin && user.role !== 'admin' && user.role !== 'superadmin') {
      // Elevate existing account to admin
      user.role = 'admin';
      await user.save();
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      data: {
        user: user.toSafeObject(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe,
  clerkSync
};
