const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Alert message is required'],
      trim: true,
      maxlength: 300,
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'Critical'],
      required: [true, 'Severity level is required'],
    },
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    zone: {
      type: String,
      required: true,
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alert', alertSchema);
