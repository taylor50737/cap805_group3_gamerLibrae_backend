// app.js is seperated from server.js to export app for API endpoint testing

/* MongoStore will automatically store session into mongoDB if you modify the session
   i.e.: setting req.session.(some attribute) = (some value),
   it will automatically clear the session in db if expire/ when req.session.destroy() is called
   If you access req.session.(some attribute), it will automatically look up from mongoDB to look for that value
   */
const MongoStore = require('connect-mongo');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const qs = require('qs');

const HttpError = require('./models/http-error');

const authRoutes = require('./routes/auth-routes');
const usersRoutes = require('./routes/users-routes');
const commentsRoutes = require('./routes/comments-routes');
const gamesRoutes = require('./routes/games-routes');
const cloudinaryRoutes = require('./routes/cloudinary-routes');
const affiliationRoutes = require('./routes/affiliation-routes');

const mongoURI =
  'mongodb+srv://phlo1:kBv3QMUlOCquHua6@senecacap805.nvo6weo.mongodb.net/?retryWrites=true&w=majority'; // env

const app = express();

// Comma seperated query parameter convert to array
app.set('query parser', function (str) {
  // Remove trailing comma
  str = decodeURIComponent(str)
    .split('&')
    .map((p) => p.replace(/,+$/, ''))
    .join('&');
  return qs.parse(str, { comma: true });
});

app.use(bodyParser.json());

// Middlewares (session)
app.use(express.json());
app.use(
  session({
    name: 'gamerLibrae.sid',
    secret: 'key that sign cookie', // env
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure: true,  // uncomment this in production, need to change server to https
      maxAge: 5 * 60 * 1000, // 5 mnis
    },
    store: MongoStore.create({
      mongoUrl: mongoURI,
      dbName: 'testSession',
      collectionName: 'sessions',
      ttl: 5 * 60, // destroy session in server after 5 mins of creation
    }),
  }),
);

// CORS-handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept',
  );
  if ('OPTIONS' == req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Custom routes handler
app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/comments', commentsRoutes);
app.use('/api/games', gamesRoutes);
app.use('/api/cloudinary', cloudinaryRoutes);
app.use('/api/affiliations', affiliationRoutes);

// 404 not found
app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

// Error handling
app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

module.exports = app;
