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

// Get a review with id
router.get('/:id', reviewsController.getReview);

// Get a review by user id
router.get('/user/:uid', reviewsController.getReviewsByUserId)

module.exports = router;
