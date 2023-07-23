const Review = require('../models/review');
const mongoose = require('mongoose');

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
  console.log(req.body);
  if (!mongoose.Types.ObjectId.isValid(gameId)) {
    console.log('game id wrong');
    console.log(gameId);

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

  try {
    await review.save();
  } catch (err) {
    const error = new HttpError('Post review failed, please try again.', 500);
    return next(error);
  }
  return res.send({ message: 'Post review successed' });
};

exports.getReview = getReview;
exports.postReview = postReview;
