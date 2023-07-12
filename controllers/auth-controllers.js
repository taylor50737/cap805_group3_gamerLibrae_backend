const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const sendCurrentSession = (req, res) => {
  const user = req.session.user;
  res.send({
    loggedIn: true,
    admin: user.isAdmin,
    // affiliated: user.joinedAffiliation,
    affiliation: user.affiliation,
    userName: user.userName,
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
    avatar: 'https://robohash.org/etimpeditcorporis.png?size=50x50&set=set1',
    reviews: [],
    comments: [],
    favouriteGame: [],
    wishList: []
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
    res.status(400).send({ error: 'missing email or password' });
    return;
  }

  const user = await User.findOne({ email });
  const isSamePassword = await bcrypt.compare(password, user ? user.password : '');

  if (!user || !isSamePassword) {
    res.status(409).send({ error: 'incorrect email or password' });
    return;
  }
  // need to alter the session to enable express-session sending cookie
  // pick useful properties
  req.session.user = (({ userName, email, isAdmin, affiliation }) => ({
    userName,
    email,
    isAdmin,
    affiliation,
  }))(user);
  //req.session.regenerate(() => {console.log("regen session")});
  res.status(200).send({ success: 'successfully logged in' });
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

exports.sendCurrentSession = sendCurrentSession;
exports.signup = signup;
exports.login = login;
exports.logout = logout;
