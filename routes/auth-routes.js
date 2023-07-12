const express = require('express');
const { check } = require('express-validator');

const authController = require('../controllers/auth-controllers');

const router = express.Router();

// const bcrypt = require('bcrypt');
// const Users = require('../models/user');

// middleware to require login
const logInRequired = (req, res, next) => {
  console.log(req.session.user);
  if (!req.session.user) {
    res.status(400).send({ error: 'not logged in yet' });
    return;
  }
  next();
};

// router.get('/resource', logInRequired, (req, res) => {
//   res.send('resource get');
// });

// auth current session
router.get('/users/me', logInRequired, authController.sendCurrentSession);

// router.get('/users/me', logInRequired, (req, res) => {
//   const user = req.session.user;
//   res.send({
//     loggedIn: true,
//     admin: user.isAdmin,
//     affiliated: user.joinedAffiliation,
//     userName: user.userName,
//   });
// });

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

// router.post('/users', async (req, res) => {
//   const { userName, email, password } = req.body;
//   console.log(userName, email, password);
//   if (!userName || !email || !password) {
//     res.status(400).send({ error: 'missing userName, email or password' });
//     return;
//   }

//   let user = await Users.findOne({ email });
//   if (user) {
//     res.status(409).send({ error: 'email already exist' });
//     return;
//   }
//   const hashedPassword = await bcrypt.hash(password, 12);
//   user = new Users({
//     userName,
//     email,
//     password: hashedPassword,
//     isAdmin: false,
//     status: 'active',
//     joinedAffiliation: false,
//   });
//   await user.save();
//   res.status(200).send({ success: 'successfully registered' });
// });

// login
router.post('/session', authController.login);

// logout
router.delete('/session', logInRequired, authController.logout);

module.exports = router;
