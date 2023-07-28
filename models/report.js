const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  reportDateTime: {
    type: Date,
    required: true,
  },
  reportContent: {
    type: String,
    required: true,
  },
  review: {
    type: mongoose.Types.ObjectId,
    required: function () {
      return !this.comment; // `review` is required if `comment` is not present
    },
    ref: 'Review',
  },
  comment: {
    type: mongoose.Types.ObjectId,
    required: function () {
      return !this.review; // `comment` is required if `review` is not present
    },
    ref: 'Comment',
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = mongoose.model('Report', reportSchema);
