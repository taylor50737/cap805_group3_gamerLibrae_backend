const express = require('express');

const usersController = require('../controllers/users-controllers')

const router = express.Router();

router.get('/', usersController.getUsers);

router.get('/:uid', usersController.getUserById);

module.exports = router;
