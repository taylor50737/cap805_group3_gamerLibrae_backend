require('dotenv').config();

const mongoose = require('mongoose');

const HTTP_PORT = process.env.PORT || 8080;
const mongoURI =
  'mongodb+srv://phlo1:kBv3QMUlOCquHua6@senecacap805.nvo6weo.mongodb.net/?retryWrites=true&w=majority'; // env
const OnHttpStart = () => {
  console.log('Server listening on port: ' + HTTP_PORT);
};

const app = require('./app');

// Must connect to db before starting the server
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'testSession', //env
  })
  .then(() => {
    app.listen(HTTP_PORT, OnHttpStart);
  })
  .catch((err) => {
    console.log(err);
  });
