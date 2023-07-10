const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    required: true,
  },
  avatar: {
    type: String,
  },
  status: {
    type: String,
    required: true,
  },
  favouriteGame: {
    type: String,
  },
  wishList: {
    type: String,
  },
  channelURL: {
    type: String,
  },
  joinedAffiliation: {
    type: Boolean,
    required: true,
  },
  affiliation: {
    affId: {
      type: Number,
    },
    affChannelURL: {
      type: String,
    },
    affEmail: {
      type: String,
    },
  },
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;
