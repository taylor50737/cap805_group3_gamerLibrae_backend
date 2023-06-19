const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();

require("dotenv").config();
const usersRoutes = require('./routes/users-routes')

const HTTP_PORT = process.env.PORT || 8080;
const mongoURI = "mongodb+srv://phlo1:kBv3QMUlOCquHua6@senecacap805.nvo6weo.mongodb.net/?retryWrites=true&w=majority";

const Users = require("./models/Users");
const Games = require("./models/Games");
const Reviews = require("./models/Reviews");

mongoose.connect(mongoURI).then(() => console.log("db connected"));

app.use('/api/users', usersRoutes);

const usersData = JSON.parse(
  fs.readFileSync("./testing_data/Users.json", "utf-8")
);
const gamesData = JSON.parse(
  fs.readFileSync("./testing_data/Games.json", "utf-8")
);
const reviewsData = JSON.parse(
  fs.readFileSync("./testing_data/Reviews.json", "utf-8")
);

const importUsersData = async () => {
  try {
    await Users.create(usersData);
    console.log("Users data successfully imported");
  } catch (error) {
    console.log("error", error);
  }
};

const importGamesData = async () => {
  try {
    await Games.create(gamesData);
    console.log("Games data successfully imported");
  } catch (error) {
    console.log("error", error);
  }
};

const importReviewsData = async () => {
  try {
    await Reviews.create(reviewsData);
    console.log("Reviews data successfully imported");
  } catch (error) {
    console.log("error", error);
  }
};

const importAllData = async () => {
  await Promise.all([
    importUsersData(),
    importGamesData(),
    importReviewsData(),
  ]);

  // All data import operations completed
  process.exit();
};

// Uncomment importAllData() to start import JSON data to MongoDB
// importAllData();

app.get("/", (req, res) => {
  res.send({message: "Hello 852_code9"});
})

app.use(express.json());
app.use(cors());

const OnHttpStart = () => {
  console.log("Server listening on port: " + HTTP_PORT);
};

app.listen(HTTP_PORT, OnHttpStart);
