const mongoose = require('mongoose');

const noteModel = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please add a title to the note"]
  },
  date: {
    type: Date,
    default: Date.now,
  },
  content: {
    type: String,
    required: [true, "Please add a content to the note"],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  category: {
    type: String,
  },
  subject: {
    type: String,
  }
});

noteModel.index({ title: 'text', category: 'text', subject: 'text'});

module.exports = mongoose.model("notes", noteModel);