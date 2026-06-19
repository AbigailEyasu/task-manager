const fs = require('fs');

// Load tasks from file
const loadTasks = () => {
  if (!fs.existsSync('tasks.json')) return [];
  const data = fs.readFileSync('tasks.json', 'utf-8');
  return JSON.parse(data);
};

// Save tasks to file
const saveTasks = (tasks) => {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
};

// Add a task
const addTask = (title) => {
  const tasks = loadTasks();
  const newTask = {
    id: tasks.length + 1,
    title: title,
    done: false
  };
  tasks.push(newTask);
  saveTasks(tasks);
  console.log(`Task added: "${title}"`);
};

// List all tasks with optional filter
const listTasks = (filter) => {
  const tasks = loadTasks();
  if (tasks.length === 0) {
    console.log('No tasks yet!');
    return;
  }

  let filteredTasks = tasks;

  if (filter === '--done') {
    filteredTasks = tasks.filter(t => t.done === true);
  } else if (filter === '--pending') {
    filteredTasks = tasks.filter(t => t.done === false);
  }

  filteredTasks.forEach(task => {
    const status = task.done ? '✅' : '❌';
    console.log(`${status} [${task.id}] ${task.title}`);  // ✅ fixed
  });
};

// Mark task as done
const completeTask = (id) => {
  const tasks = loadTasks();
  const task = tasks.find(t => t.id === parseInt(id));
  if (task) {
    task.done = true;
    saveTasks(tasks);
    console.log(`Task ${id} marked as done!`);  // ✅ fixed
  } else {
    console.log(`Task ${id} not found`);         // ✅ fixed
  }
};

// Delete a task
const deleteTask = (id) => {
  const tasks = loadTasks();
  const filtered = tasks.filter(t => t.id !== parseInt(id));
  if (filtered.length === tasks.length) {
    console.log(`Task ${id} not found`);   // ✅ fixed
    return;
  }
  saveTasks(filtered);
  console.log(`Task ${id} deleted!`);     // ✅ fixed
};

// Read command from terminal
const command = process.argv[2];
const argument = process.argv[3];

if (command === 'add') {
  addTask(argument);
} else if (command === 'list') {
  listTasks(argument);
} else if (command === 'done') {
  completeTask(argument);
} else if (command === 'delete') {
  deleteTask(argument);
} else {
  console.log('Commands: add "task" | list | done <id> | delete <id>');
}