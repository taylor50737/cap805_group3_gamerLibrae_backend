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
    dbName: 'testSession', // change to test db in .env
  });
});

afterAll(async () => {
  await User.deleteOne({ email: 'existing_user@test.com' });
  await mongoose.connection.close();
});

describe('sign up', () => {
  test('return 201 when sign up success', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ userName: 'new_user', email: 'new_user@test.com', password: 'new_user' });
    expect(res.statusCode).toEqual(201);
  });
});
