require("dotenv").config();
const cors = require('cors');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const logger = require('./logger');
const createAuthRouter = require('./auth');
const authenticateToken = require('./middleware/auth');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const TASK_SELECT = {
  id: true,
  title: true,
  done: true,
  priority: true,
  createdAt: true,
  userId: true
};

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/auth', createAuthRouter(prisma));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.get('/test', (req, res) => {
  res.json({ message: 'NEW SERVER WITH PRIORITY!' });
});

app.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const { done, priority } = req.query;
    const filter = {};
    if (done !== undefined) filter.done = done === 'true';
    if (priority) filter.priority = priority;
    const tasks = await prisma.task.findMany({
      where: filter,
      select: TASK_SELECT,
      orderBy: { createdAt: 'desc' }
    });
    res.json(tasks);
  } catch (error) {
    logger.error('GET ALL ERROR:', { message: error.message });
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.get('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      select: TASK_SELECT
    });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    logger.error('GET BY ID ERROR:', { message: error.message });
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});

app.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { title, priority = 'Medium' } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    if (!['High', 'Medium', 'Low'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be High, Medium or Low' });
    }
    const task = await prisma.task.create({
      data: { title, priority },
      select: TASK_SELECT
    });
    res.status(201).json(task);
  } catch (error) {
    logger.error('POST ERROR:', { message: error.message });
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.put('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, done, priority } = req.body;
    if (priority && !['High', 'Medium', 'Low'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be High, Medium or Low' });
    }
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, done, priority },
      select: TASK_SELECT
    });
    res.json(task);
  } catch (error) {
    logger.error('PUT ERROR:', { message: error.message });
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.patch('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { done, title, priority } = req.body;
    if (priority && !['High', 'Medium', 'Low'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be High, Medium or Low' });
    }
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { done, title, priority },
      select: TASK_SELECT
    });
    res.json(task);
  } catch (error) {
    logger.error('PATCH ERROR:', { message: error.message });
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Task deleted!' });
  } catch (error) {
    logger.error('DELETE ERROR:', { message: error.message });
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.listen(3000, () => {
  logger.info('Server running on port 3000');
});