import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let tasks = [
  {
    id: 1,
    title: 'Welcome to Task Manager',
    description: 'This is your first task! Edit or delete it to get started.',
    category: 'personal',
    priority: 'medium',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'Explore the features',
    description: 'Try creating new tasks with different priorities and categories.',
    category: 'work',
    priority: 'high',
    status: 'pending',
    createdAt: new Date().toISOString(),
  }
];

let nextId = 3;

// API Routes
app.get('/api/tasks', (req, res) => {
  res.json(tasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

app.post('/api/tasks', (req, res) => {
  const { title, description, category, priority } = req.body;
  
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const newTask = {
    id: nextId++,
    title,
    description: description || '',
    category: category || 'personal',
    priority: priority || 'medium',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { title, description, category, priority, status } = req.body;
  
  tasks[taskIndex] = {
    ...tasks[taskIndex],
    title: title || tasks[taskIndex].title,
    description: description !== undefined ? description : tasks[taskIndex].description,
    category: category || tasks[taskIndex].category,
    priority: priority || tasks[taskIndex].priority,
    status: status || tasks[taskIndex].status,
    updatedAt: new Date().toISOString(),
  };

  res.json(tasks[taskIndex]);
});

app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(task => task.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(taskIndex, 1);
  res.json({ message: 'Task deleted successfully' });
});

app.get('/api/stats', (req, res) => {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(task => task.status === 'completed').length,
    pending: tasks.filter(task => task.status === 'pending').length,
    highPriority: tasks.filter(task => task.priority === 'high').length,
  };
  
  res.json(stats);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});