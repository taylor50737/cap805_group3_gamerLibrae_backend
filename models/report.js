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
    required: true,
    ref: 'Review',
  },
  comment: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Comment',
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = mongoose.model('Report', reportSchema);
