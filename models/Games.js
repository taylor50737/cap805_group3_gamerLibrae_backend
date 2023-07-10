const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GameSchema = new Schema({
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
  platform: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
  },
});

const Games = mongoose.model('Games', GameSchema);

module.exports = Games;
