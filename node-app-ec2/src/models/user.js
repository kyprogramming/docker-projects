const mongoose = require('mongoose');

// Define schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

// Create model
const User = mongoose.model('User', userSchema);

module.exports = User; // Export the model
