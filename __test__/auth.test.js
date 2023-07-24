// Name: Siu Yu CHAU
// Student ID: 134368224
// Testing Authentication

const request = require('supertest');
const mongoose = require('mongoose');

const app = require('../app');
const User = require('../models/user');

const mongoURI =
  'mongodb+srv://phlo1:kBv3QMUlOCquHua6@senecacap805.nvo6weo.mongodb.net/?retryWrites=true&w=majority'; // env

beforeAll(async () => {
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: '__testAuth__', // change to test db in .env
  });

  const bcrypt = require('bcrypt');
  hashedPassword = await bcrypt.hash('existing_user', 12);

  const createdUser = new User({
    email: 'existing_user@test.com',
    userName: 'existing_user',
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
  await User.deleteOne({ email: 'existing_user@test.com' });
  await mongoose.connection.db.dropDatabase();
  await mongoose.connection.close();
});

describe('sign up', () => {
  afterAll(async () => {
    await User.deleteOne({ email: 'new_user@test.com' });
  });

  test('return 201 when sign up success', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ userName: 'new_user', email: 'new_user@test.com', password: 'new_user' });
    expect(res.statusCode).toEqual(201);
  });

  test('return 422 when request body not complete', async () => {
    const res = await request(app).post('/api/auth/signup').send({ userName: 'new_user' });
    expect(res.statusCode).toEqual(422);
    expect(res.body.message).toEqual('Invalid input passed, please check your data.');
  });

  test('return 422 when user already exist', async () => {
    const res = await request(app).post('/api/auth/signup').send({
      userName: 'existing_user',
      email: 'existing_user@test.com',
      password: 'existing_user',
    });
    expect(res.statusCode).toEqual(422);
    expect(res.body.message).toEqual('User exists already, please login instead.');
  });
});

describe('sign in', () => {
  test('return 200 when sign in success', async () => {
    const res = await request(app)
      .post('/api/auth/session')
      .send({ email: 'existing_user@test.com', password: 'existing_user' });
    expect(res.statusCode).toEqual(200);
    expect(res.header['set-cookie']).toBeTruthy();
  });

  test('return 400 when missing password or email', async () => {
    const res = await request(app)
      .post('/api/auth/session')
      .send({ email: 'existing_user@test.com' });
    expect(res.statusCode).toEqual(400);
  });

  test('return 409 when email or password incorrect', async () => {
    const res = await request(app)
      .post('/api/auth/session')
      .send({ email: 'existing_user@test.com', password: 'sssss' });

    expect(res.statusCode).toEqual(409);
  });
});

describe('auth me', () => {
  let cookie;
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/session')
      .send({ email: 'existing_user@test.com', password: 'existing_user' });
    cookie = res.header['set-cookie'];
  });

  test('return 200 when auth me success', async () => {
    const res = await request(app).get('/api/auth/users/me').set('Cookie', cookie);
    expect(res.statusCode).toEqual(200);
    expect(res.body.loggedIn).toBe(true);
  });
});

describe('log out', () => {
  let cookie;
  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/session')
      .send({ email: 'existing_user@test.com', password: 'existing_user' });
    cookie = res.header['set-cookie'];
  });

  test('return 200 when log out success', async () => {
    const res = await request(app).delete('/api/auth/session').set('Cookie', cookie);
    expect(res.statusCode).toEqual(200);
  });
});
