const express = require('express');
const { check } = require('express-validator');

const usersController = require('../controllers/users-controllers');
const authMiddleware = require('../middleware/auth-middleware');

const router = express.Router();

router.get('/', usersController.getUsers);

router.get('/:uid', usersController.getUserById);

router.patch(
  '/change-info',
  authMiddleware.loginRequired,
  [(check('userName').not().isEmpty(), check('url').isURL())],
  usersController.changeUserInfo,
);

// router.post('/affiliation/signup')

module.exports = router;
