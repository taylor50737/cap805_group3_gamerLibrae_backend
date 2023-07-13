const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO (revised review schema)
const ReviewSchema = new Schema({
  userId: {
    type: Number,
    required: true,
  },
  gameId: {
    type: Number,
    required: true,
  },
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
  postDate: {
    type: Date,
    required: true,
  },
  comments: {
    commentId: {
      type: Number,
      required: true,
    },
    commentUserId: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    commentReportCount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    reports: {
      reportID: {
        type: Number,
        required: true,
      },
      reportUserID: {
        type: Number,
        required: true,
      },
      report: {
        type: String,
        required: true,
      },
    },
  },
  reviewReportCount: {
    type: Number,
    required: true,
  },
  reviewStatus: {
    type: String,
    required: true,
  },
  reports: {
    reportId: {
      type: Number,
      required: true,
    },
    report_userId: {
      type: Number,
      required: true,
    },
    report: {
      type: String,
      required: true,
    },
  },
});

const Reviews = mongoose.model('Reviews', ReviewSchema);

module.exports = Reviews;
