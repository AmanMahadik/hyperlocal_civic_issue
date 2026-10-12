const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, default: '' }
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: [
        'pending',
        'verified',
        'rejected',
        'assigned',
        'in_progress',
        'resolved',
        'closed',
        'reopened'
      ]
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    note: {
      type: String,
      default: ''
    },
    at: {
      type: Date,
      default: Date.now
    }
  },
  { _id: true }
);

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an issue title'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters']
    },
    description: {
      type: String,
      required: [true, 'Please describe the issue'],
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Please select a category']
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    ward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ward',
      default: null
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
        validate: {
          validator: function (v) {
            return (
              Array.isArray(v) &&
              v.length === 2 &&
              v[0] >= -180 &&
              v[0] <= 180 &&
              v[1] >= -90 &&
              v[1] <= 90
            );
          },
          message: 'Invalid [longitude, latitude] coordinates'
        }
      }
    },
    address: {
      type: String,
      trim: true,
      default: ''
    },
    images: [imageSchema],
    resolutionImages: [imageSchema],
    status: {
      type: String,
      enum: [
        'pending',
        'verified',
        'rejected',
        'assigned',
        'in_progress',
        'resolved',
        'closed',
        'reopened'
      ],
      default: 'pending'
    },
    rejectionReason: {
      type: String,
      default: ''
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    upvotes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    upvoteCount: {
      type: Number,
      default: 0
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    statusHistory: [statusHistorySchema],
    dueDate: {
      type: Date,
      default: null
    },
    resolvedAt: {
      type: Date,
      default: null
    },
    closedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

issueSchema.index({ location: '2dsphere' });
issueSchema.index({ status: 1, ward: 1, category: 1, createdAt: -1 });
issueSchema.index({ reporter: 1, createdAt: -1 });

const Issue = mongoose.model('Issue', issueSchema);
module.exports = Issue;
