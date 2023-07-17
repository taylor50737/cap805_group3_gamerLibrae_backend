const { body } = require('express-validator');

const express = require('express');
const router = express.Router();

const postGameController = require('../controllers/games-controller');
const { loginRequired, adminRequired } = require('../middleware/auth-middleware');
const { validateImageSignature } = require('../middleware/games-middleware');

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
  postGameController.postGame,
);

module.exports = router;
