// Check user is logged in
const loginRequired = (req, res, next) => {
  if (!req.session.user) {
    console.log('req.session.user not exist:');
    console.log(req.session.user);
    res.status(400).json({ error: 'not logged in yet' });
    return;
  }
  next();
};

// Check user is admin
const adminRequired = (req, res, next) => {
  if (!req.session.user.isAdmin) {
    res.status(400).json({ error: 'not admin' });
    return;
  }
  next();
};

exports.loginRequired = loginRequired;
exports.adminRequired = adminRequired;
