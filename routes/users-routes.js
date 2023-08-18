const express = require('express');
const { check, body } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const authMiddleware = require('../middleware/auth-middleware');

const { validateImageSignature } = require('../middleware/games-middleware');

const router = express.Router();

router.get('/', usersController.getUsers);

router.get('/:uid', usersController.getUserById);

router.get('/wishlist/:uid', usersController.getWishListByUserId);

router.patch(
  '/change-info',
  authMiddleware.loginRequired,
  [check('userName').not().isEmpty(), check('url').isURL()],
  usersController.changeUserInfo,
);

router.patch(
  '/change-password',
  // authMiddleware.loginRequired,
  [
    check('currentPassword').not().isEmpty(),
    check('newPassword').isLength({ min: 8 }),
    check('confirmPassword').isLength({ min: 8 }),
    usersController.changePassword,
  ],
);

router.patch(
  '/change-profilepic',
  authMiddleware.loginRequired,
  [body('avatar').notEmpty()],
  usersController.changeUserProfilePic,
);

module.exports = router;
