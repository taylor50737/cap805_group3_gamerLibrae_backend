const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const Affiliaiton = require('../models/affiliation');
const User = require('../models/user');
const Auth = require('./auth-controllers');
const mongoose = require('mongoose');

//Only for testing
const getAllAff = async (req, res, next) => {
  let affiliations;
  try {
    affiliations = await Affiliaiton.find();
  } catch (err) {
    const error = new HttpError('Fetching comments failed, please try again later.', 500);
    return next(error);
  }
  res.json({
    affiliations: affiliations.map((affiliation) => affiliation.toObject({ getters: true })),
  });
};
//

const postAff = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid input passed, please check your data.', 422));
  }

  const { affChannelURL, affEmail } = req.body;

  const userId = req.session.user._id;

  let existingAffChannelURL;
  try {
    existingAffChannelURL = await Affiliaiton.findOne({ affChannelURL: affChannelURL });
  } catch (err) {
    const error = new HttpError('Registration failed, please try again later.', 500);
    return next(error);
  }

  if (existingAffChannelURL) {
    const error = new HttpError('This channelURL has already been registered.', 422);
    return next(error);
  }

  let existingAffEmail;
  try {
    existingAffEmail = await Affiliaiton.findOne({ affEmail: affEmail });
  } catch (err) {
    const error = new HttpError('Registration failed, please try again later.', 500);
    return next(error);
  }

  if (existingAffEmail) {
    const error = new HttpError('This email has already been registered.', 422);
    return next(error);
  }

  // Create the affiliation
  const createdAffiliation = new Affiliaiton({
    affChannelURL,
    affEmail,
  });

  // Find the user by userId
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    const error = new HttpError('User searching operation failed, please try again.', 500);
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for this id.', 402);
    return next(error);
  }

  if (!user.affiliation.affEmail) {
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdAffiliation.save({ session: sess });
      user.affiliation = createdAffiliation;
      await user.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
      const error = new HttpError('Registration failed, please try again.', 500);
      return next(error);
    }
  } else {
    const error = new HttpError(
      'This user id has already been registered to the affiliation program.',
      402,
    );
    return next(error);
  }

  res.status(201).json({ affiliation: createdAffiliation.toObject({ getters: true }) });
  res.status(201).json({ user: user.toObject({ getters: true }) });
};

//Only for testing
const deleteAffiliationById = async (req, res, next) => {
  const filter = { _id: req.params.affid };
  try {
    let doc = await Affiliaiton.findOneAndDelete(filter);
    res.json(doc);
  } catch (err) {
    const error = new HttpError('Delete comment failed, please try again.', 500);
    return next(error);
  }
};
//

exports.getAllAff = getAllAff;
exports.postAff = postAff;
exports.deleteAffiliationById = deleteAffiliationById;
