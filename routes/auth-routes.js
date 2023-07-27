const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth-controllers');
const authMiddleware = require('../middleware/auth-middleware');
const router = express.Router();

// auth current session
router.get('/users/me', authController.sendCurrentSession, authMiddleware.loginRequired,);

// register
router.post(
  '/signup',
  [
    check('email').normalizeEmail().isEmail(),
    check('userName').isLength({ min: 3 }),
    check('password').isLength({ min: 3 }),
  ],
  authController.signup,
);

// login
router.post('/session', authController.login);

// logout
router.delete('/session', authMiddleware.loginRequired, authController.logout);

// forgot pw
router.post(
  '/forgot-password',
  [check('email').normalizeEmail().isEmail()],
  authController.forgotPassword,
);

// reset pw
router.post(
  '/reset-password/:uid/:token',
  [
    check('newPassword').isLength({ min: 3 }),
    check('confirmNewPassword').isLength({ min: 3 }),
  ],
  authController.resetPassword,
);

module.exports = router;
