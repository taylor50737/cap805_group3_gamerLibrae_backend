const request = require('supertest');

const app = require('../app');

describe('login', () => {
  it('responds with json', async () => {
    const res = await request(app)
      .post('/api/auth/session')
      .send({ email: 'abc@abc.com', password: 'abc' });
    expect(res.statusCode).toEqual(200);
  });
});
