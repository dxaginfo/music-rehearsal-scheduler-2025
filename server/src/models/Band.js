const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BandSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      enum: ['admin', 'member', 'guest'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  settings: {
    defaultReminders: [{
      type: Number,
      default: [60, 1440] // 1 hour and 1 day in minutes
    }],
    defaultDuration: {
      type: Number,
      default: 120 // 2 hours in minutes
    },
    defaultLocation: {
      name: String,
      address: String,
      coordinates: {
        lat: Number,
        lng: Number
      }
    }
  },
  avatar: {
    type: String
  }
}, {
  timestamps: true
});

// Ensure creator is always an admin
BandSchema.pre('save', function(next) {
  if (this.isNew) {
    const creatorExists = this.members.some(member => 
      member.userId.toString() === this.createdBy.toString() && member.role === 'admin'
    );
    
    if (!creatorExists) {
      this.members.push({
        userId: this.createdBy,
        role: 'admin',
        joinedAt: new Date()
      });
    }
  }
  next();
});

module.exports = mongoose.model('Band', BandSchema);