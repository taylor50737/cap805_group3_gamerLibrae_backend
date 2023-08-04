const mongoose = require('mongoose');
const Review = require('../models/review');
const Game = require('../models/game');
const User = require('../models/user');
const Comment = require('../models/comment');
const HttpError = require('../models/http-error');

const getReview = async (req, res, next) => {
  const reviewId = req.params.id;

  const error = new HttpError('Post review failed, please try again.', 500);
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    return next(error);
  }

  let matchedReview;
  try {
    matchedReview = await Review.aggregate()
      .lookup({
        from: 'comments',
        localField: 'comments',
        foreignField: '_id',
        as: 'comments',
      })
      .project({
        __v: 0,
        reports: 0,
        comments: { __v: 0, reports: 0 },
      })
      .match({ _id: new mongoose.Types.ObjectId(reviewId) })
      .exec();
  } catch (err) {
    console.log(err);
    // Just send nothing if params is not correctly input
    return res.send({});
  }
  return res.send(matchedReview.length === 1 ? matchedReview[0] : {});
};

const getReviewsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithReviews;
  try {
    userWithReviews = await User.findById(userId).populate('reviews');
  } catch (err) {
    const error = new HttpError('Fetching reviews failed, please try again later', 500);
    return next(error);
  }
  res.json({
    reviews: userWithReviews.reviews.map((review) => review.toObject({ getters: true })),
  });
};

const postReview = async (req, res, next) => {
  const { rating, title, content, gameId } = req.body;
  const userId = req.session.user._id;
  console.log(`${rating} ${title} ${gameId} ${content}`);
  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    return res.send({});
  }
  const review = new Review({
    rating: rating,
    title: title ? title : '(No title)',
    content: content,
    postingDate: new Date(),
    status: 'public',
    game: new mongoose.Types.ObjectId(gameId),
    creator: new mongoose.Types.ObjectId(req.session.user._id),
    vote: 0,
  });

  let createdReview;
  try {
    createdReview = await review.save();
    // Update reference of reviews in game aswell
    await Game.findByIdAndUpdate(gameId, { $push: { reviews: createdReview._id } });
  } catch (err) {
    const error = new HttpError('Post review failed, please try again.', 500);
    return next(error);
  }

  // Update reference of reviews in user
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

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await review.save({ session: sess });
    user.reviews.push(review);
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError('Creating review failed, please try again.');
    return next(error);
  }
  return res.status(201).send(createdReview);
};

//Get all reviews
const getAllReviews = async (req, res, next) => {
  let reviews;
  try {
    reviews = await Review.find();
  } catch (err) {
    const error = new HttpError('Fetching comments failed, please try again later.', 500);
    return next(error);
  }
  res.json({ reviews: reviews.map((review) => review.toObject({ getters: true })) });
};

const postComment = async (req, res, next) => {
  const { content } = req.body;
  const reviewId = req.params.id;
  const userId = req.session.user._id;

  const comment = new Comment({
    content: content,
    status: 'public',
    review: new mongoose.Types.ObjectId(reviewId),
    creator: new mongoose.Types.ObjectId(userId),
  });
  let createdComment;
  try {
    createdComment = await comment.save();
    await User.findByIdAndUpdate(userId, { $push: { comments: createdComment._id } });
    await Review.findByIdAndUpdate(reviewId, { $push: { comments: createdComment._id } });
  } catch (err) {
    const error = new HttpError('Post comment failed.', 500);
    return next(error);
  }
  return res.status(201).send(createdComment);
};

exports.getReview = getReview;
exports.getReviewsByUserId = getReviewsByUserId;
exports.postReview = postReview;
exports.getAllReviews = getAllReviews;
exports.postComment = postComment;
