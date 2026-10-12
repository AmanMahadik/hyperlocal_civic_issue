const Issue = require('../models/Issue');
const Category = require('../models/Category');
const Ward = require('../models/Ward');
const Comment = require('../models/Comment');
const { saveImageBuffer, removeImage } = require('../middleware/upload');
const { findWardByCoordinates } = require('../utils/wardLookup');
const { calculateDynamicPriority } = require('../utils/priority');
const { findNearbyDuplicates } = require('../utils/duplicateCheck');

// @desc    Create a new civic issue report
// @route   POST /api/issues
// @access  Private (Citizen)
const createIssue = async (req, res, next) => {
  const savedImages = [];
  try {
    const { title, description, categoryId, address } = req.body;
    let coordinates = req.body.coordinates;

    if (typeof coordinates === 'string') {
      try {
        coordinates = JSON.parse(coordinates);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coordinates format. Expected [longitude, latitude]'
        });
      }
    }

    if (!title || !description || !categoryId || !coordinates) {
      return res.status(400).json({
        success: false,
        message: 'Title, description, category, and map location are required'
      });
    }

    const [lng, lat] = coordinates;
    if (isNaN(lng) || isNaN(lat)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinate numbers'
      });
    }

    // 1. Verify Category
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Selected category not found'
      });
    }

    // 2. Detect Ward via geospatial query
    const detectedWard = await findWardByCoordinates([lng, lat]);
    if (!detectedWard) {
      return res.status(400).json({
        success: false,
        message:
          'Selected location is outside Pimpri-Chinchwad Municipal Corporation (PCMC) boundaries. Please select a point within PCMC.'
      });
    }

    // 3. Process uploaded photos
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadResult = await saveImageBuffer(
          file.buffer,
          file.originalname,
          'pcmc_issues'
        );
        savedImages.push(uploadResult);
      }
    }

    // 4. Create Issue document
    const issue = new Issue({
      title,
      description,
      category: category._id,
      reporter: req.user._id,
      ward: detectedWard._id,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)]
      },
      address: address || '',
      images: savedImages,
      status: 'pending',
      priority: category.defaultPriority || 'medium',
      statusHistory: [
        {
          status: 'pending',
          changedBy: req.user._id,
          note: 'Issue reported by citizen',
          at: new Date()
        }
      ]
    });

    await issue.save();

    const populatedIssue = await Issue.findById(issue._id)
      .populate('category', 'name code icon department slaDays')
      .populate('ward', 'name number zone')
      .populate('reporter', 'name email');

    res.status(201).json({
      success: true,
      message: 'Issue reported successfully and queued for admin verification',
      data: populatedIssue
    });
  } catch (error) {
    // Cleanup any uploaded images if database save fails
    for (const img of savedImages) {
      await removeImage(img.publicId);
    }
    next(error);
  }
};

// @desc    Get all issues with filters & pagination
// @route   GET /api/issues
// @access  Public
const getIssues = async (req, res, next) => {
  try {
    const {
      status,
      category,
      ward,
      priority,
      search,
      page = 1,
      limit = 20,
      sort = '-createdAt'
    } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }
    if (category) {
      filter.category = category;
    }
    if (ward) {
      filter.ward = ward;
    }
    if (priority) {
      filter.priority = priority;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } }
      ];
    }

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Issue.countDocuments(filter);
    const issues = await Issue.find(filter)
      .populate('category', 'name code icon department')
      .populate('ward', 'name number zone')
      .populate('reporter', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: issues.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: issues
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get issues nearby for map view & duplicate check
// @route   GET /api/issues/nearby
// @access  Public
const getNearbyIssues = async (req, res, next) => {
  try {
    const { lng, lat, radius = 5000, categoryId } = req.query;

    if (!lng || !lat) {
      return res.status(400).json({
        success: false,
        message: 'Longitude (lng) and Latitude (lat) are required query parameters'
      });
    }

    const maxDistance = parseInt(radius, 10);
    const query = {
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: maxDistance
        }
      }
    };

    if (categoryId) {
      query.category = categoryId;
    }

    const issues = await Issue.find(query)
      .populate('category', 'name code icon')
      .populate('ward', 'name number')
      .limit(50);

    res.json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get issues reported by logged-in citizen
// @route   GET /api/issues/mine
// @access  Private
const getMyIssues = async (req, res, next) => {
  try {
    const issues = await Issue.find({ reporter: req.user._id })
      .populate('category', 'name code icon department')
      .populate('ward', 'name number zone')
      .sort('-createdAt');

    res.json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single issue detail with history
// @route   GET /api/issues/:id
// @access  Public
const getIssueById = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('category', 'name code icon department slaDays')
      .populate('ward', 'name number zone boundary')
      .populate('reporter', 'name email')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name role');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    res.json({
      success: true,
      data: issue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle upvote on an issue
// @route   POST /api/issues/:id/upvote
// @access  Private (Citizen)
const upvoteIssue = async (req, res, next) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const userIdStr = req.user._id.toString();
    const upvoteIndex = issue.upvotes.findIndex(
      (uid) => uid.toString() === userIdStr
    );

    let hasUpvoted = false;
    if (upvoteIndex > -1) {
      // Remove upvote
      issue.upvotes.splice(upvoteIndex, 1);
    } else {
      // Add upvote
      issue.upvotes.push(req.user._id);
      hasUpvoted = true;
    }

    issue.upvoteCount = issue.upvotes.length;
    // Recalculate priority automatically
    issue.priority = calculateDynamicPriority(issue.priority, issue.upvoteCount);

    await issue.save();

    res.json({
      success: true,
      data: {
        upvoteCount: issue.upvoteCount,
        hasUpvoted,
        priority: issue.priority
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reporter confirms resolution or reopens
// @route   POST /api/issues/:id/confirm
// @access  Private (Reporter only)
const confirmResolution = async (req, res, next) => {
  try {
    const { action, note } = req.body; // action: 'confirm' or 'reopen'

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    if (issue.reporter.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Only the citizen who reported this issue can confirm or reopen it'
      });
    }

    if (issue.status !== 'resolved') {
      return res.status(400).json({
        success: false,
        message: `Cannot confirm or reopen issue in status '${issue.status}'. Must be 'resolved'.`
      });
    }

    if (action === 'confirm') {
      issue.status = 'closed';
      issue.closedAt = new Date();
      issue.statusHistory.push({
        status: 'closed',
        changedBy: req.user._id,
        note: note || 'Resolution confirmed and closed by citizen',
        at: new Date()
      });
    } else if (action === 'reopen') {
      issue.status = 'reopened';
      issue.statusHistory.push({
        status: 'reopened',
        changedBy: req.user._id,
        note: note || 'Issue reopened by citizen: problem not resolved satisfactorily',
        at: new Date()
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid action. Choose 'confirm' or 'reopen'"
      });
    }

    await issue.save();

    res.json({
      success: true,
      message: `Issue marked as ${issue.status}`,
      data: issue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to issue
// @route   POST /api/issues/:id/comments
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required'
      });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const comment = await Comment.create({
      issue: issue._id,
      user: req.user._id,
      text: text.trim()
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      'user',
      'name role'
    );

    res.status(201).json({
      success: true,
      data: populatedComment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for an issue
// @route   GET /api/issues/:id/comments
// @access  Public
const getComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ issue: req.params.id })
      .populate('user', 'name role')
      .sort('createdAt');

    res.json({
      success: true,
      count: comments.length,
      data: comments
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createIssue,
  getIssues,
  getNearbyIssues,
  getMyIssues,
  getIssueById,
  upvoteIssue,
  confirmResolution,
  addComment,
  getComments
};
