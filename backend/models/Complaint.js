const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Complaint title is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Network Issue',
        'Billing Problem',
        'Poor Signal',
        'Internet Speed',
        'Customer Service',
        'Roaming Issue',
        'SIM Card Problem',
        'Other',
      ],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      minlength: 20,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    serviceAddress: {
      type: String,
      trim: true,
    },
    preferredContactMethod: {
      type: String,
      enum: ['Phone', 'Email', 'Any'],
      default: 'Phone',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved', 'Closed'],
      default: 'Pending',
    },
    adminNote: {
      type: String,
      default: '',
    },
    resolvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Auto-set resolvedAt when status changes to Resolved
complaintSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'Resolved') {
    this.resolvedAt = new Date();
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
