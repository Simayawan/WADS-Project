//Redundant file, we switched to NeonDB

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    // Removed 'required' so it doesn't crash if you don't send it yet
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Crucial for security
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  password: { // Added this field so the DB can actually save it
    type: String,
    required: true,
    minlength: 8
  },
  role: {
    type: String,
    enum: ['learner', 'admin'],
    default: 'learner'
  }
});

// This handles the "Module build failed" error by checking if the model exists first
module.exports = mongoose.models.User || mongoose.model('User', UserSchema);