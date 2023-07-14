const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth-controllers');

const router = express.Router();

// middleware to require login
const logInRequired = (req, res, next) => {
  console.log(req.session.user);
  if (!req.session.user) {
    res.status(400).send({ error: 'not logged in yet' });
    return;
  }
  next();
};

// auth current session
router.get('/users/me', logInRequired, authController.sendCurrentSession);

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
router.delete('/session', logInRequired, authController.logout);

module.exports = router;
