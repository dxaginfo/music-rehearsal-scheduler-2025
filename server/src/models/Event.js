const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  bandId: {
    type: Schema.Types.ObjectId,
    ref: 'Band',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  location: {
    name: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurringPattern: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      required: function() { return this.isRecurring; }
    },
    interval: {
      type: Number,
      default: 1,
      min: 1
    },
    daysOfWeek: [{
      type: Number,
      min: 0,
      max: 6
    }],
    endDate: Date,
    count: Number
  },
  reminders: [{
    time: Number, // minutes before event
    sent: {
      type: Boolean,
      default: false
    }
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  parentEventId: {
    type: Schema.Types.ObjectId,
    ref: 'Event'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', EventSchema);