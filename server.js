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

const app = express();
app.use(cors());
app.use(express.json());
app.use('/auth', createAuthRouter(prisma));
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});
// Log every request
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// GET all tasks
app.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    logger.error('GET ALL ERROR:', { message: error.message });
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// GET task by ID
app.get('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) }
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

// POST create a task
app.post('/tasks', authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const task = await prisma.task.create({
      data: { title }
    });
    res.status(201).json(task);
  } catch (error) {
    logger.error('POST ERROR:', { message: error.message });
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT update whole task
app.put('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, done } = req.body;
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { title, done }
    });
    res.json(task);
  } catch (error) {
    logger.error('PUT ERROR:', { message: error.message });
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// PATCH update specific fields
app.patch('/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { done, title } = req.body;
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { done, title }
    });
    res.json(task);
  } catch (error) {
    logger.error('PATCH ERROR:', { message: error.message });
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE a task
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