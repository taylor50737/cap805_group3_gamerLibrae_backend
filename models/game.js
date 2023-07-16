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
  genres: [
    {
      type: String,
      required: true,
    },
  ],
  platforms: [
    {
      type: String,
      required: true,
    },
  ],
  modes: [
    {
      type: String,
      required: true,
    },
  ],
  tags: [
    {
      type: String,
      required: true,
    },
  ],
  banner: {
    type: String,
    required: true,
  },
  portrait: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'Review',
    },
  ],
});

module.exports = mongoose.model('Game', gameSchema);
