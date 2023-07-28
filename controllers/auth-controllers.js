const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const sendCurrentSession = (req, res) => {
  const user = req.session.user;
  res.send({
    loggedIn: true,
    admin: user.isAdmin,
    affiliation: user.affiliation,
    userName: user.userName,
    userId: user._id,
    avatar: user.avatar
  });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input passed, please check your data.', 422));
  }
  const { email, userName, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again later.', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError('User exists already, please login instead.', 422);
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
    const error = new HttpError('Username already used, please use another.', 422);
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError('Could not create user, please try again.', 500);
    return next(error);
  }

  const createdUser = new User({
    email,
    userName,
    password: hashedPassword,
    avatar: 'https://i.pinimg.com/1200x/bc/61/73/bc61734ebf52dbc0a34ef25200a9db29.jpg',
    reviews: [],
    comments: [],
    favouriteGame: [],
    wishList: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ error: 'Missing email or password' });
    return;
  }

  const user = await User.findOne({ email });
  const isSamePassword = await bcrypt.compare(password, user ? user.password : '');

  if (!user || !isSamePassword) {
    res.status(409).send({ error: 'Incorrect email or password' });
    return;
  }
  // need to alter the session to enable express-session sending cookie
  // pick useful properties
  req.session.user = (({ _id, userName, email, isAdmin, affiliation, avatar }) => ({
    _id,
    userName,
    email,
    isAdmin,
    affiliation,
    avatar,
  }))(user);
  // This is to prevent response is sent before session is saved in database, in this situation the following bug may occur:
  // This bug is hard to reproduce since the time required to save session is unpredictable
  // Send login success and cookies to client => client request auth me with cookies attached
  // => since session not saved in backend => response 400 => but session actually available shortly after 400 response is sent
  req.session.save(function (err) {
    // session saved
    res.status(200).send({ success: 'successfully logged in' });
  });
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie('gamerLibrae.sid');
    if (err) {
      res.status(400).send('Unable to log out');
    } else {
      res.send('successfully logged out');
    }
  });
};

const forgotPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input passed, please check your data.', 422));
  }
  const { email } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError('Something wrong, please try again later.', 500);
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError('This email is not registered.', 422);
    return next(error);
  }

  const secretKey = existingUser._id + process.env.JWT_KEY;

  const token = jwt.sign({ userID: existingUser._id }, secretKey, {
    expiresIn: '5m',
  });

  const link = `${process.env.FRONTEND_URL}/auth/reset-password/${existingUser._id}/${token}`;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Reset Password',
    text: link,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.status(201).json({
    message: 'Password reset instructions have been mailed to the email address you provided.',
  });
};

const resetPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input passed, please check your data.', 422));
  }
  const { newPassword, confirmNewPassword } = req.body;
  const { uid, token } = req.params;

  if (newPassword !== confirmNewPassword) {
    const error = new HttpError('Password and confirm password does not match', 422);
    return next(error);
  }

  let user;
  try {
    user = await User.findById(uid);
  } catch (err) {
    const error = new HttpError('Something wrong, please try again', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Cannot find this user', 400);
    return next(error);
  }
  // Verify token
  const secretKey = user.id + process.env.JWT_KEY;
  try {
    jwt.verify(token, secretKey);
  } catch (err) {
    const error = new HttpError('Link has been Expired', 400);
    return next(error);
  }

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

  res.status(200).json({ message: 'Password changed!' });
};

exports.sendCurrentSession = sendCurrentSession;
exports.signup = signup;
exports.login = login;
exports.logout = logout;
exports.forgotPassword = forgotPassword;
exports.resetPassword = resetPassword;
