require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth-routes');
const usersRoutes = require('./routes/users-routes')
const HttpError = require('./models/http-error');

const session = require('express-session');
/* MongoStore will automatically store session into mongoDB if you modify the session
   i.e.: setting req.session.(some attribute) = (some value),
   it will automatically clear the session in db if expire/ when req.session.destroy() is called
   If you access req.session.(some attribute), it will automatically look up from mongoDB to look for that value
   */
const MongoStore = require('connect-mongo');

const HTTP_PORT = process.env.PORT || 8080;
const mongoURI =
  'mongodb+srv://phlo1:kBv3QMUlOCquHua6@senecacap805.nvo6weo.mongodb.net/?retryWrites=true&w=majority';
const OnHttpStart = () => {
  console.log('Server listening on port: ' + HTTP_PORT);
};

const app = express();

app.use(bodyParser.json());

// Middlewares (session)
app.use(express.json());
app.use(
  session({
    name: 'gamerLibrae.sid',
    secret: 'key that sign cookie',
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
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
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
// app.use('/api', authRoutes);
app.use('/api/users', usersRoutes);

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

// Must connect to db before starting the server
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'testSession',
  })
  .then(() => {
    app.listen(HTTP_PORT, OnHttpStart);
  })
  .catch((err) => {
    console.log(err);
  });
