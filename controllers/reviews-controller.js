const mongoose = require('mongoose');
const Review = require('../models/review');
const Game = require('../models/game');
const HttpError = require('../models/http-error');

const getReview = async (req, res) => {
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

const postReview = async (req, res) => {
  const { rating, title, content, gameId } = req.body;
  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    return res.send({});
  }
  const review = new Review({
    rating: rating,
    title: title,
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
  return res.status(201).send(createdReview);
};

exports.getReview = getReview;
exports.postReview = postReview;
