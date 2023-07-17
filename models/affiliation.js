const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const affiliationSchema = new Schema({
  affChannelURL: {
    type: String,
    required: true,
    unique: true,
  },
  affEmail: {
    type: String,
    required: true,
    unique: true,
  },
});

affiliationSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Affiliation', affiliationSchema);
