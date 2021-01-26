const mongoose = require ('mongoose');

const userSchema = new mongoose.Schema ({
  username: {
    type: String,
    required: true,
    minLength: 3,
  },
  email: {
    type: String,
    required: true,
    maxLength: 255,
    minLength: 6,
  },
  password: {
    type: String,
    required: true,
    maxLength: 100,
    minLength: 6,
  },
  favourties: [{
      mapURL: String,
      title: String,
    }]
});

module.exports = mongoose.model ('User', userSchema);
