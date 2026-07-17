const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/tasks', (req, res) => {
  const { title, priority = 'Medium' } = req.body;
  if (!title) return res.status(400).json({ error: 'Title is required' });
  if (!['High', 'Medium', 'Low'].includes(priority)) {
    return res.status(400).json({ error: 'Priority must be High, Medium or Low' });
  }
  res.status(201).json({ id: 1, title, priority, done: false });
});

describe('Health Check', () => {
  test('GET /health returns ok', async () => {
    const response = await request(app).get('/health');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

describe('Task Priority', () => {
  test('POST /tasks creates task with High priority', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ title: 'Fix bug', priority: 'High' });
    expect(response.statusCode).toBe(201);
    expect(response.body.priority).toBe('High');
  });

  test('POST /tasks defaults to Medium priority', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ title: 'Regular task' });
    expect(response.statusCode).toBe(201);
    expect(response.body.priority).toBe('Medium');
  });

  test('POST /tasks rejects invalid priority', async () => {
    const response = await request(app)
      .post('/tasks')
      .send({ title: 'Bad task', priority: 'Urgent' });
    expect(response.statusCode).toBe(400);
  });
});