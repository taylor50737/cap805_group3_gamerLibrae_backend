const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  postDate: {
    type: Date,
    required: true,
  },
  review: {
    type: mongoose.Types.ObjectId,
    // required: true,
    ref: 'Review',
  },
  creator: {
    type: mongoose.Types.ObjectId,
    // required: true,
    ref: 'User',
  },
  reports: [
    {
      type: mongoose.Types.ObjectId,
      // required: true,
      ref: 'Report',
    },
  ],
});

module.exports = mongoose.model('Comment', commentSchema);
