const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const reviewsController = require('../controllers/reviews-controller');
const { loginRequired } = require('../middleware/auth-middleware');

// Post a game
router.post(
  '/',
  loginRequired,
  [
    body('rating').notEmpty(),
    body('title').notEmpty(),
    body('content').notEmpty(),
    body('gameId').notEmpty(),
  ],
  reviewsController.postReview,
);

//Get all reviews
router.get('/', reviewsController.getAllReviews);

// Get a review with id
router.get('/:id', reviewsController.getReview);

// Post a comment with id
router.post(
  '/:id/comments',
  loginRequired,
  body('content').notEmpty(),
  reviewsController.postComment,
);

// Get a review by user id
router.get('/user/:uid', reviewsController.getReviewsByUserId);

//Delete a review by review id
router.delete('/:rid', reviewsController.deleteReviewById);

module.exports = router;
