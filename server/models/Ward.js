const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema(
  {
    number: {
      type: Number,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    zone: {
      type: String,
      trim: true,
      default: 'PCMC'
    },
    boundary: {
      type: {
        type: String,
        enum: ['Polygon', 'MultiPolygon'],
        required: true,
        default: 'Polygon'
      },
      coordinates: {
        type: Array,
        required: true
      }
    }
  },
  {
    timestamps: true
  }
);

wardSchema.index({ boundary: '2dsphere' });

const Ward = mongoose.model('Ward', wardSchema);
module.exports = Ward;
