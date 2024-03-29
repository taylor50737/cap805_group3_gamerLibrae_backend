const { body } = require('express-validator');

const express = require('express');
const router = express.Router();

const gamesController = require('../controllers/games-controller');
const { loginRequired, adminRequired } = require('../middleware/auth-middleware');
const { validateImageSignature } = require('../middleware/games-middleware');

// Add a game
router.post(
  '/',
  loginRequired,
  adminRequired,
  [
    body('name').notEmpty(),
    body('developer').notEmpty(),
    body('publisher').notEmpty(),
    body('releaseDate').notEmpty(),
    body('genres').isArray({ min: 1 }),
    body('platforms').isArray({ min: 1 }),
    body('modes').isArray({ min: 1 }),
    body('tags').isArray(),
    body('bannerResBody').notEmpty(),
    body('portraitResBody').notEmpty(),
  ],
  validateImageSignature,
  gamesController.postGame,
);

// Get games with queries as filter
router.get('/', gamesController.getGames);

// Get a game with id
router.get('/:id', gamesController.getGame);

// Add a game to wishlist
router.patch('/wishlist/:id', loginRequired, gamesController.addGameToWishList);

module.exports = router;
