const request = require('supertest');
const app = require('./server');

describe('Auth', () => {
  test('POST /auth/register creates a user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({ email: `test${Date.now()}@example.com`, password: 'password123' });

    expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe('User created!');
  });
});