const mongoose = require('mongoose');

const userModel = mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add your name"]
  },
  surname: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Please add your email"]
  },
  picture: {
    type: String,
  },
  identifier: {
    type: String,
  }
});

module.exports = mongoose.model("users", userModel);