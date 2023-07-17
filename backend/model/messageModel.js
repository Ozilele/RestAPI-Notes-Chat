const mongoose = require('mongoose');

const messageModel = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  text: {
    type: String,
  },
  file: {
    type: String,
  }
}, {timestamps: true});

module.exports = mongoose.model('message', messageModel);