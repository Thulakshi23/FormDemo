// models/user.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Method to compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hash password before saving user
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10); // Hash the password
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
