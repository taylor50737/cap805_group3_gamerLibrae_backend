const mongoose = require('mongoose');

const HTTP_PORT = process.env.PORT || 8080;
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@senecacap805.nvo6weo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`; // env
const OnHttpStart = () => {
  console.log('Server listening on port: ' + HTTP_PORT);
};

const app = require('./app');

// Must connect to db before starting the server
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(HTTP_PORT, OnHttpStart);
  })
  .catch((err) => {
    console.log(err);
  });
