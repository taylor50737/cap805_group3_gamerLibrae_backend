const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 3,
    },
    avatar: {
      type: String,
    },
    channelURL: {
      type: String,
    },
    status: {
      type: String,
      required: true,
      default: 'active',
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    affiliation: { type: Schema.Types.Mixed, default: {} },
    reviews: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Review' }],
    comments: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Comment' }],
    favouriteGame: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Game' }],
    wishList: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Game' }],
  },
  { minimize: false },
);

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
