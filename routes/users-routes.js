const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const authMiddleware = require('../middleware/auth-middleware');

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

router.patch('/change-password', 
// authMiddleware.loginRequired, 
[
  check('currentPassword').not().isEmpty(),
  check('newPassword').isLength({ min: 5 }),
  check('confirmPassword').isLength({ min: 5 }),
  usersController.changePassword,
]);

module.exports = router;
