const HttpError = require('../models/http-error');
const Comment = require('../models/comment');
const User = require('../models/user');

const getAllComments = async (req, res, next) => {
  let comments;
  try {
    comments = await Comment.find();
  } catch (err) {
    const error = new HttpError('Fetching comments failed, please try again later.', 500);
    return next(error);
  }
  res.json({ comments: comments.map((comment) => comment.toObject({ getters: true })) });
};

const getCommentById = async (req, res, next) => {
  const query = Comment.where({ _id: req.params.cid });
  let comment;
  try {
    comment = await query.findOne();
  } catch (err) {
    const error = new HttpError('Fetching comment failed, please try again.', 500);
    return next(error);
  }
  res.json(comment);
};

const getCommentsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let userWithComments;
  try {
    userWithComments = await User.findById(userId).populate({
      path: 'comments',
      populate: {
        path: 'review',
        populate: [
          { path: 'game', model: 'Game' }, // Populate the game field within review
          { path: 'creator', model: 'User' }, // Populate the creator field within review
        ],
      },
    });
  } catch (err) {
    const error = new HttpError('Fetching comments failed, please try again later', 500);
    return next(error);
  }
  res.json({
    comments: userWithComments.comments.map((comment) => comment.toObject({ getters: true })),
  });
};

const postComment = async (req, res, next) => {
  const comment = new Comment(req.body);
  try {
    await comment.save();
    res.json(comment);
  } catch (err) {
    const error = new HttpError('Post comment failed, please try again.', 500);
    return next(error);
  }
};

const updateCommentById = async (req, res, next) => {
  const comment = req.body;
  const filter = { _id: req.params.cid };
  const update = { comment: comment.comment };
  try {
    let doc = await Comment.findOneAndUpdate(filter, update);
    res.json(doc);
  } catch (err) {
    const error = new HttpError('Update comment failed, please try again.', 500);
    return next(error);
  }
};

const deleteCommentById = async (req, res, next) => {
  const filter = { _id: req.params.cid };
  try {
    let doc = await Comment.findOneAndDelete(filter);
    res.json(doc);
  } catch (err) {
    const error = new HttpError('Delete comment failed, please try again.', 500);
    return next(error);
  }
};

exports.getAllComments = getAllComments;
exports.getCommentById = getCommentById;
exports.getCommentsByUserId = getCommentsByUserId;
exports.postComment = postComment;
exports.updateCommentById = updateCommentById;
exports.deleteCommentById = deleteCommentById;
