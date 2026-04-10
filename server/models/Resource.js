const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Resource name is required'],
      trim: true,
      // e.g., "Ambulance RJ-20-1111", "Food Palette #12", "Medical Kit B-07"
    },
    type: {
      type: String,
      enum: ['Truck', 'Van', 'Ambulance', 'Medical Kit', 'Food Supply', 'Water Tank', 'Generator', 'Chainsaw', 'Rescue Equipment', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['Available', 'Requested', 'In Transit', 'In Use', 'Maintenance', 'Allocated', 'Returned'],
      default: 'Available',
    },
    assignedTo: {
      // The volunteer who currently has this resource
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedZone: {
      type: String,
      default: null,
    },
    quantity: {
      type: Number,
      default: 1,
      min: 0,
    },
    notes: {
      type: String,
      default: '',
      maxlength: 200,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Resource', resourceSchema);
