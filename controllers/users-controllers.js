const HttpError = require('../models/http-error');
const User = require('../models/user');
const bcrypt = require('bcrypt');
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
    const error = new HttpError('Something went wrong1, could not find the user.', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find the user for the provided id.', 404);
    return next(error);
  }

  res.json({ user: user.toObject({ getters: true }) });
};

const getWishListByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let userWithWishList;
  try {
    userWithWishList = await User.findById(userId).populate({
      path: 'wishList',
      populate: {
        path: 'reviews',
        model: 'Review', // Replace 'Review' with your actual review model name
      },
    });
  } catch (err) {
    const error = new HttpError('Fetching wish list failed, please try again later', 500);
    return next(error);
  }

  const updatedWishList = userWithWishList.wishList.map((game) => {

    const totalReviews = game.reviews.length;
    const totalRating = game.reviews.reduce((sum, review) => sum + review.rating, 0);
    const score = totalReviews > 0 ? totalRating / totalReviews : 0;

    return {
      ...game.toObject({ getters: true }),
      score,
    };
  });

  res.json({
    wishList: updatedWishList,
  });
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
  }

  let existingUsername;
  try {
    existingUsername = await User.findOne({ userName: userName });
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }

  if (existingUsername) {
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

const changePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input passed, please check your data.', 422));
  }
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const userId = req.session.user._id;

  if (newPassword !== confirmPassword) {
    const error = new HttpError('Password and confirm password does not match', 422);
    return next(error);
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not change password', 500);
    return next(error);
  }

  if (user._id.toString() !== userId) {
    const error = new HttpError('You are not allowed to change the password of this user', 401);
    return next(error);
  }

  let isSamePassword; 
  try {
    isSamePassword = await bcrypt.compare(currentPassword, user.password);
  } catch (err) {
    const error = new HttpError('Something went wrong, could not change password', 500);
    return next(error);
  }

  if (!isSamePassword) {
    const error = new HttpError('Your current password is incorrect', 401);
    return next(error);  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError('Something wrong, please try again.', 500);
    return next(error);
  }
  user.password = hashedPassword;

  try {
    await user.save();
  } catch (err) {
    const error = new HttpError('Something went wrong, could not change password.', 500);
    return next(error);
  }

  res.status(200).json({ message: 'You have successfully changed your password!' });
};

exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.getWishListByUserId = getWishListByUserId;
exports.changeUserInfo = changeUserInfo;
exports.changePassword = changePassword;
