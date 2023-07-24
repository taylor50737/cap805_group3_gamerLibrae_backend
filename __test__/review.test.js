const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const Game = require('../models/game');
const Review = require('../models/review');
const User = require('../models/user');

const mongoURI =
  'mongodb+srv://phlo1:kBv3QMUlOCquHua6@senecacap805.nvo6weo.mongodb.net/?retryWrites=true&w=majority'; // env

let fakeGame;
beforeAll(async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: '__testReview__', // use testSession because I need users
  });

  fakeGame = new Game({
    name: 'gg',
    developer: 'dd',
    publisher: 'pp',
    releaseDate: new Date().toISOString(),
    genres: ['gg'],
    platforms: ['pp'],
    modes: ['mm'],
    tags: ['tt'],
    banner: 'bb',
    portrait: 'pp',
  });

  await fakeGame.save();

  const bcrypt = require('bcrypt');
  const hashedPassword = await bcrypt.hash('review', 12);
  const createdUser = new User({
    email: 'review@test.com',
    userName: 'review',
    password: hashedPassword,
    avatar: 'https://robohash.org/etimpeditcorporis.png?size=50x50&set=set1',
    reviews: [],
    comments: [],
    favouriteGame: [],
    wishList: [],
  });
  await createdUser.save();
});

afterAll(async () => {
  await Game.deleteMany({});
  await User.deleteMany({});
  await Review.deleteMany({});

  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

// const logSpy = jest.spyOn(console, 'log');
// console.log(getGameRes.body);
// expect(logSpy).toHaveBeenCalledWith(getGameRes.body);

describe('post review', () => {
  test('post review is working', async () => {
    // login before posting review
    const loginRes = await request(app)
      .post('/api/auth/session')
      .send({ email: 'review@test.com', password: 'review' });
    const cookie = loginRes.header['set-cookie'];

    const searchGameRes = await request(app).get('/api/games?name=gg');

    const postReviewRes = await request(app)
      .post('/api/reviews')
      .send({
        rating: 80,
        title: 'good game',
        content: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
        gameId: searchGameRes.body[0]._id,
      })
      .set('Cookie', cookie);

    expect(loginRes.status).toEqual(200);
    expect(searchGameRes.status).toEqual(200);
    expect(postReviewRes.status).toEqual(201);
  });
});

describe('get review by id', () => {
  let postReviewRes;

  beforeAll(async () => {
    const loginRes = await request(app)
      .post('/api/auth/session')
      .send({ email: 'review@test.com', password: 'review' });
    const cookie = loginRes.header['set-cookie'];

    const searchGameRes = await request(app).get('/api/games?name=gg');

    postReviewRes = await request(app)
      .post('/api/reviews')
      .send({
        rating: 75,
        title: 'haha',
        content: 'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum',
        gameId: searchGameRes.body[0]._id,
      })
      .set('Cookie', cookie);
  });

  test('get review by id is working', async () => {
    const res = await request(app).get(`/api/reviews/${postReviewRes.body._id}`);
    expect(res.status).toEqual(200);
    expect(res.body._id).toEqual(postReviewRes.body._id);
    expect(res.body.title).toEqual(postReviewRes.body.title);
  });
});
