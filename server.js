require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const HTTP_PORT = process.env.PORT || 8080;
const mongoURI =
  'mongodb+srv://phlo1:kBv3QMUlOCquHua6@senecacap805.nvo6weo.mongodb.net/?retryWrites=true&w=majority';
const OnHttpStart = () => {
  console.log('Server listening on port: ' + HTTP_PORT);
};

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  const error = new HttpError('Could not find this route.', 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
  .connect(mongoURI)
  .then(() => app.listen(HTTP_PORT, OnHttpStart))
  .catch((err) => console.log(err));
