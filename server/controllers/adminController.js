const Issue = require('../models/Issue');
const Category = require('../models/Category');
const Ward = require('../models/Ward');
const { saveImageBuffer } = require('../middleware/upload');
const { ALLOWED_TRANSITIONS } = require('../../shared/constants');

// @desc    Get admin verification queue (pending issues)
// @route   GET /api/admin/queue
// @access  Private (Admin, Superadmin)
const getVerificationQueue = async (req, res, next) => {
  try {
    const { ward, category, priority } = req.query;
    const filter = { status: 'pending' };

    if (ward) filter.ward = ward;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;

    const issues = await Issue.find(filter)
      .populate('category', 'name code icon department slaDays')
      .populate('ward', 'name number zone')
      .populate('reporter', 'name email phone')
      .sort({
        // Priority weight: critical > high > medium > low, then oldest first
        createdAt: 1
      });

    res.json({
      success: true,
      count: issues.length,
      data: issues
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify issue (moves pending to verified)
// @route   PATCH /api/issues/:id/verify
// @access  Private (Admin)
const verifyIssue = async (req, res, next) => {
  try {
    const { note, categoryId, priority } = req.body;
    const issue = await Issue.findById(req.params.id).populate('category');

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    if (issue.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Only pending issues can be verified. Current status: ${issue.status}`
      });
    }

    // Optional admin adjustments
    if (categoryId) {
      const newCategory = await Category.findById(categoryId);
      if (newCategory) {
        issue.category = newCategory._id;
      }
    }

    if (priority && ['low', 'medium', 'high', 'critical'].includes(priority)) {
      issue.priority = priority;
    }

    // Calculate Due Date based on category SLA
    const slaDays = (issue.category && issue.category.slaDays) || 3;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + slaDays);
    issue.dueDate = dueDate;

    issue.status = 'verified';
    issue.statusHistory.push({
      status: 'verified',
      changedBy: req.user._id,
      note: note || 'Issue verified by PCMC staff',
      at: new Date()
    });

    await issue.save();

    const updated = await Issue.findById(issue._id)
      .populate('category', 'name code icon department slaDays')
      .populate('ward', 'name number zone')
      .populate('reporter', 'name email');

    res.json({
      success: true,
      message: 'Issue verified successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Reject issue with mandatory reason
// @route   PATCH /api/issues/:id/reject
// @access  Private (Admin)
const rejectIssue = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is mandatory'
      });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    if (['resolved', 'closed'].includes(issue.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot reject issue that is already ${issue.status}`
      });
    }

    issue.status = 'rejected';
    issue.rejectionReason = reason.trim();
    issue.statusHistory.push({
      status: 'rejected',
      changedBy: req.user._id,
      note: `Rejected: ${reason.trim()}`,
      at: new Date()
    });

    await issue.save();

    res.json({
      success: true,
      message: 'Issue rejected',
      data: issue
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Assign issue to officer / field agent
// @route   PATCH /api/issues/:id/assign
// @access  Private (Admin)
const assignIssue = async (req, res, next) => {
  try {
    const { assignedTo, note } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    if (!['verified', 'reopened'].includes(issue.status)) {
      return res.status(400).json({
        success: false,
        message: `Issue must be verified or reopened before assigning. Current status: ${issue.status}`
      });
    }

    if (assignedTo) {
      issue.assignedTo = assignedTo;
    }

    issue.status = 'assigned';
    issue.statusHistory.push({
      status: 'assigned',
      changedBy: req.user._id,
      note: note || 'Issue assigned to departmental team',
      at: new Date()
    });

    await issue.save();

    const updated = await Issue.findById(issue._id)
      .populate('category', 'name code icon department')
      .populate('ward', 'name number zone')
      .populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Issue assigned successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update issue status (in_progress, resolved) with resolution photos
// @route   PATCH /api/issues/:id/status
// @access  Private (Admin)
const updateStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    // Validate workflow transition
    const allowed = ALLOWED_TRANSITIONS[issue.status] || [];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition from '${issue.status}' to '${status}'. Allowed: ${allowed.join(', ') || 'none'}`
      });
    }

    // If resolving, handle resolution images
    if (status === 'resolved') {
      const resolutionImages = [];
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await saveImageBuffer(
            file.buffer,
            file.originalname,
            'pcmc_resolutions'
          );
          resolutionImages.push(result);
        }
      }
      if (resolutionImages.length > 0) {
        issue.resolutionImages = resolutionImages;
      }
      issue.resolvedAt = new Date();
    }

    issue.status = status;
    issue.statusHistory.push({
      status,
      changedBy: req.user._id,
      note: note || `Status updated to ${status}`,
      at: new Date()
    });

    await issue.save();

    const updated = await Issue.findById(issue._id)
      .populate('category', 'name code icon department')
      .populate('ward', 'name number zone')
      .populate('assignedTo', 'name email')
      .populate('statusHistory.changedBy', 'name role');

    res.json({
      success: true,
      message: `Status updated to ${status}`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard metrics & analytics
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Status count breakdown
    const statusCounts = await Issue.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Format status counts into clean key-value object
    const statusMap = {
      pending: 0,
      verified: 0,
      assigned: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
      rejected: 0,
      reopened: 0
    };
    statusCounts.forEach((sc) => {
      if (sc._id) statusMap[sc._id] = sc.count;
    });

    // 2. Count by Category
    const categoryCounts = await Issue.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      {
        $project: {
          _id: 1,
          name: '$category.name',
          code: '$category.code',
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    // 3. Count by Ward
    const wardCounts = await Issue.aggregate([
      {
        $group: {
          _id: '$ward',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'wards',
          localField: '_id',
          foreignField: '_id',
          as: 'ward'
        }
      },
      { $unwind: '$ward' },
      {
        $project: {
          _id: 1,
          name: '$ward.name',
          number: '$ward.number',
          zone: '$ward.zone',
          count: 1
        }
      },
      { $sort: { number: 1 } }
    ]);

    // 4. Overdue SLA breaches
    const now = new Date();
    const slaBreaches = await Issue.countDocuments({
      status: { $in: ['verified', 'assigned', 'in_progress'] },
      dueDate: { $lt: now }
    });

    // 5. Total issues
    const totalIssues = await Issue.countDocuments();

    // 6. Average resolution time (in hours)
    const resolvedIssues = await Issue.find({
      resolvedAt: { $ne: null },
      createdAt: { $ne: null }
    }).select('createdAt resolvedAt');

    let avgResolutionHours = 0;
    if (resolvedIssues.length > 0) {
      const totalMs = resolvedIssues.reduce((acc, iss) => {
        return acc + (new Date(iss.resolvedAt) - new Date(iss.createdAt));
      }, 0);
      avgResolutionHours = Math.round(
        totalMs / resolvedIssues.length / (1000 * 60 * 60)
      );
    }

    res.json({
      success: true,
      data: {
        totalIssues,
        statusCounts: statusMap,
        categoryCounts,
        wardCounts,
        slaBreaches,
        avgResolutionHours
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVerificationQueue,
  verifyIssue,
  rejectIssue,
  assignIssue,
  updateStatus,
  getDashboardStats
};
