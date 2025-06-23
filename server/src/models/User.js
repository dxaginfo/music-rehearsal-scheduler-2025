const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: function() { return !this.googleId; }
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  instruments: [{
    type: String,
    trim: true
  }],
  googleId: {
    type: String,
    unique: true,
    sparse: true
  },
  avatar: {
    type: String
  },
  preferences: {
    notificationPreferences: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      inApp: { type: Boolean, default: true }
    },
    availabilityPattern: {
      monday: [{
        start: { type: String },
        end: { type: String }
      }],
      tuesday: [{
        start: { type: String },
        end: { type: String }
      }],
      wednesday: [{
        start: { type: String },
        end: { type: String }
      }],
      thursday: [{
        start: { type: String },
        end: { type: String }
      }],
      friday: [{
        start: { type: String },
        end: { type: String }
      }],
      saturday: [{
        start: { type: String },
        end: { type: String }
      }],
      sunday: [{
        start: { type: String },
        end: { type: String }
      }]
    }
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);