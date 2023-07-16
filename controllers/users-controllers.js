const HttpError = require('../models/http-error');
const User = require('../models/user');
const { validationResult } = require('express-validator');

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Fetching users failed, please try again later.', 500);
    return next(error);
  }
  res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const getUserById = async (req, res, next) => {
  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not find the user.', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find the user for the provided id.', 404);
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const changeUserInfo = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid inputs passed, please check your data.', 422));
  }
  const { userName, url } = req.body;
  const userId = req.session.user._id;

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update user', 500);
    return next(error);
  }

  if (user._id.toString() !== userId) {
    const error = new HttpError('You are not allowed to change the info of this user', 401);
    return next(error);
  } else if (user.userName === userName) {
    const error = new HttpError('Username already exists', 409);
    return next(error);
  }

  user.userName = userName;
  user.channelURL = url;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not update user.', 500);
    return next(error);
  }

  res.status(200).json({ message: 'You have successfully changed your info!' });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.changeUserInfo = changeUserInfo;
