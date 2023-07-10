const express = require('express');
const cors = require('cors');
const session = require('express-session');
const mongoose = require('mongoose');
/* MongoStore will automatically store session into mongoDB if you modify the session
   i.e.: setting req.session.(some attribute) = (some value),
   it will automatically clear the session in db if expire/ when req.session.destroy() is called
   If you access req.session.(some attribute), it will automatically look up from mongoDB to look for that value
   */
const MongoStore = require('connect-mongo');
const fs = require('fs');

const usersRoutes = require('./routes/users-routes');
const authRoutes = require('./routes/authRoutes');

const app = express();
require('dotenv').config();

const HTTP_PORT = process.env.PORT || 8080;
const mongoURI =
  'mongodb+srv://phlo1:kBv3QMUlOCquHua6@senecacap805.nvo6weo.mongodb.net/?retryWrites=true&w=majority';

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'testSession',
  })
  .then(() => console.log('db connected'));

// Middlewares
app.use(express.json());
app.use(cors({ credentials: true, origin: true }));
// Enabling CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});
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
// app.use('/api/users', usersRoutes);
app.use('/api', authRoutes);

/* import dummy data
const Users = require('./models/Users');
const Games = require('./models/Games');
const Reviews = require('./models/Reviews');

const usersData = JSON.parse(fs.readFileSync('./testing_data/Users.json', 'utf-8'));
const gamesData = JSON.parse(fs.readFileSync('./testing_data/Games.json', 'utf-8'));
const reviewsData = JSON.parse(fs.readFileSync('./testing_data/Reviews.json', 'utf-8'));

const importUsersData = async () => {
  try {
    await Users.create(usersData);
    console.log('Users data successfully imported');
  } catch (error) {
    console.log('error', error);
  }
};

const importGamesData = async () => {
  try {
    await Games.create(gamesData);
    console.log('Games data successfully imported');
  } catch (error) {
    console.log('error', error);
  }
};

const importReviewsData = async () => {
  try {
    await Reviews.create(reviewsData);
    console.log('Reviews data successfully imported');
  } catch (error) {
    console.log('error', error);
  }
};

const importAllData = async () => {
  await Promise.all([importUsersData(), importGamesData(), importReviewsData()]);

  // All data import operations completed
  process.exit();
};

// Uncomment importAllData() to start import JSON data to MongoDB
// importAllData();
*/

// 404 not found
app.get('*', (req, res) => {
  res.status(404).send('404 not found');
});

const OnHttpStart = () => {
  console.log('Server listening on port: ' + HTTP_PORT);
};

app.listen(HTTP_PORT, OnHttpStart);
