const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  reportType: {
    type: String,
    required: true,
  },
  reportDateTime: {
    type: Date,
    required: true,
  },
  reportContent: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'User',
  },
});

module.exports = mongoose.model('Report', reportSchema);
