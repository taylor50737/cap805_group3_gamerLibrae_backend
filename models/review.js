const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO (revised review schema)
const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  postingDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  game: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Game',
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  comments: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Comment',
    },
  ],
  reports: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Report',
    },
  ],
});

module.exports = mongoose.model('Review', reviewSchema);
