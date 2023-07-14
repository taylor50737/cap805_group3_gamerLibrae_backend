const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// TODO (revised game schema)
const gameSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  developer: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  releaseDate: {
    type: Date,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  platform: [
    {
      type: String,
      required: true,
    },
  ],
  tag: [
    {
      type: String,
    },
  ],
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Review',
    },
  ],
});

module.exports = mongoose.model('Game', gameSchema);
