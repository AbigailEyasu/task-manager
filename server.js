require("dotenv").config();
const cors = require('cors');
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
app.use(cors());
app.use(express.json());

app.get('/tasks', async (req, res) => {
  try {
    const tasks = await prisma.task.findMany();
    res.json(tasks);
  } catch (error) {
    console.error('GET ERROR:', error.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const task = await prisma.task.create({
      data: { title }
    });
    res.status(201).json(task);
  } catch (error) {
    console.error('POST ERROR:', error.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { done, title } = req.body;
    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: { done, title }
    });
    res.json(task);
  } catch (error) {
    console.error('PATCH ERROR:', error.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.task.delete({
      where: { id: parseInt(id) }
    });
    res.json({ message: 'Task deleted!' });
  } catch (error) {
    console.error('DELETE ERROR:', error.message);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});
app.get('/tasks/:id', async (req, res) => {
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
    console.error('GET BY ID ERROR:', error.message);
    res.status(500).json({ error: 'Failed to fetch task' });
  }
});
app.listen(3000, () => {
  console.log('Server running on port 3000');
});