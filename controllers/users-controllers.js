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

exports.getUsers = getUsers;
exports.getUserById = getUserById;
