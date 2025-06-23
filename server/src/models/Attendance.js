const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AttendanceSchema = new Schema({
  eventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['confirmed', 'declined', 'maybe', 'pending'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  responseTime: {
    type: Date
  },
  isSubstitute: {
    type: Boolean,
    default: false
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  checkInTime: {
    type: Date
  },
  checkOutTime: {
    type: Date
  }
}, {
  timestamps: true
});

// Compound index to ensure a user can only have one attendance record per event
AttendanceSchema.index({ eventId: 1, userId: 1 }, { unique: true });

// Set response time when status changes
AttendanceSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status !== 'pending') {
    this.responseTime = new Date();
  }
  next();
});

module.exports = mongoose.model('Attendance', AttendanceSchema);