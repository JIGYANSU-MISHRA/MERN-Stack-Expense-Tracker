// Import mongoose for MongoDB interaction
const mongoose = require('mongoose');

// Define the schema for users
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Export the User model
module.exports = mongoose.model('User', userSchema);

