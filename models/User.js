const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Make sure you have installed 'bcrypt' or 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide a username'],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      unique: true,
      trim: true,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    // New field to store the refresh token
    refreshToken: {
      type: String,
      select: false, // Do not return by default
    },
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'banned'],
      default: 'active',
    },
    lastLoginAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

/**
 * Pre-save Middleware
 * FIXED: Removed 'next' parameter. 
 * Since this is an async function, Mongoose waits for it to finish automatically.
 */
userSchema.pre('save', async function () {
  // 1. If password is not modified, simply return (exit the function)
  if (!this.isModified('password')) {
    return; 
  }

  // 2. Hash the password
  // (If this fails, the error will automatically bubble up to Mongoose)
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/**
 * Compare Password Method
 */
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);