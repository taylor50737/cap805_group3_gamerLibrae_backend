async function saveReviews() {
  const Review = require('../models/review');
  const Game = require('../models/game');
  const mongoose = require('mongoose');
  const mongoURI =
    'mongodb+srv://phlo1:kBv3QMUlOCquHua6@senecacap805.nvo6weo.mongodb.net/?retryWrites=true&w=majority'; // env

  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'testSession', // change to test db in .env
  });

  // const eldenRingOid = new mongoose.Types.ObjectId('64b394586600e6f01fb8ce48');

  // const review1 = new Review({
  //   rating: 50,
  //   title: 'ttitle',
  //   content: 'wtf',
  //   postingDate: '2023-05-12T04:00:00Z',
  //   status: 'banned',
  //   game: eldenRingOid,
  //   creator: new mongoose.Types.ObjectId('64af461d3e5d3436f39ad1df'),
  // });

  // const review2 = new Review({
  //   rating: 95,
  //   title: 'ttitle',
  //   content: 'wtf',
  //   postingDate: '2023-05-12T04:00:00Z',
  //   status: 'banned',
  //   game: eldenRingOid,
  //   creator: new mongoose.Types.ObjectId('64af461d3e5d3436f39ad1df'),
  // });

  // const review3 = new Review({
  //   rating: 100,
  //   title: 'ttitle',
  //   content: 'wtf',
  //   postingDate: '2023-05-12T04:00:00Z',
  //   status: 'banned',
  //   game: eldenRingOid,
  //   creator: new mongoose.Types.ObjectId('64af461d3e5d3436f39ad1df'),
  // });

  // await review1.save();
  // await review2.save();
  // await review3.save();
  // await Game.updateOne({ _id: eldenRingOid }, { $push: {reviews : review1._id} });
  // await Game.updateOne({ _id: eldenRingOid }, { $push: {reviews : review2._id} });
  // await Game.updateOne({ _id: eldenRingOid }, { $push: {reviews : review3._id} });
  // await mongoose.connection.close();
  await Game.deleteMany({
    name: { $nin: ['Elden Ring', 'The Legend of Zelda: Tears of the Kingdom'] },
  });
  console.log('execute sucess');
}

saveReviews();
