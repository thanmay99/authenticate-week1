const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // This field will be null for Google users
    phoneNumber: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

module.exports = User; 