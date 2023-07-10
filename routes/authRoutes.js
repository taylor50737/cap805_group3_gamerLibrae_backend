const bcrypt = require('bcrypt');

const express = require('express');
const router = express.Router();

const Users = require('../models/Users');

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
router.get('/users/me', logInRequired, (req, res) => {
  const user = req.session.user;
  res.send({
    loggedIn: true,
    admin: user.isAdmin,
    affiliated: user.joinedAffiliation,
    userName: user.userName,
  });
});

// register
router.post('/users', async (req, res) => {
  const { userName, email, password } = req.body;
  console.log(userName, email, password);
  if (!userName || !email || !password) {
    res.status(400).send({ error: 'missing userName, email or password' });
    return;
  }

  let user = await Users.findOne({ email });
  if (user) {
    res.status(409).send({ error: 'email already exist' });
    return;
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  user = new Users({
    userName,
    email,
    password: hashedPassword,
    isAdmin: false,
    status: 'active',
    joinedAffiliation: false,
  });
  await user.save();
  res.status(200).send({ success: 'successfully registered' });
});

// login
router.post('/session', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send({ error: 'missing email or password' });
    return;
  }

  const user = await Users.findOne({ email });
  const isSamePassword = await bcrypt.compare(password, user ? user.password : '');

  if (!user || !isSamePassword) {
    res.status(409).send({ error: 'incorrect email or password' });
    return;
  }
  // need to alter the session to enable express-session sending cookie
  // pick useful properties
  req.session.user = (({ userName, email, isAdmin, joinedAffiliation }) => ({
    userName,
    email,
    isAdmin,
    joinedAffiliation,
  }))(user);
  //req.session.regenerate(() => {console.log("regen session")});
  res.status(200).send({ success: 'successfully logged in' });
});

// logout
router.delete('/session', logInRequired, (req, res) => {
  req.session.destroy((err) => {
    res.clearCookie('gamerLibrae.sid');
    if (err) {
      res.status(400).send('Unable to log out');
    } else {
      res.send('successfully logged out');
    }
  });
});

module.exports = router;
