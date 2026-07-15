import { useState, useEffect } from 'react'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');

  const API = 'http://localhost:3000';

  // Fetch tasks when token exists
  useEffect(() => {
    if (token) fetchTasks();
  }, [token]);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${API}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setMessage('Failed to fetch tasks');
    }
  };

  const handleAuth = async () => {
    const url = isLogin ? `${API}/auth/login` : `${API}/auth/register`;
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setMessage('');
      } else {
        setMessage(data.message || data.error);
      }
    } catch (err) {
      setMessage('Something went wrong');
    }
  };

  const createTask = async () => {
    if (!newTask) return;
    try {
      const res = await fetch(`${API}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newTask })
      });
      const data = await res.json();
      setTasks([...tasks, data]);
      setNewTask('');
    } catch (err) {
      setMessage('Failed to create task');
    }
  };

  const toggleTask = async (task) => {
    try {
      const res = await fetch(`${API}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ done: !task.done })
      });
      const data = await res.json();
      setTasks(tasks.map(t => t.id === task.id ? data : t));
    } catch (err) {
      setMessage('Failed to update task');
    }
  };

  const deleteTask = async (id) => {
    try {
      await fetch(`${API}/tasks/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      setMessage('Failed to delete task');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setTasks([]);
  };

  // Show login/register form if not logged in
  if (!token) {
    return (
      <div style={styles.container}>
        <h1 style={styles.title}>Task Manager</h1>
        <div style={styles.card}>
          <h2>{isLogin ? 'Login' : 'Register'}</h2>
          {message && <p style={styles.error}>{message}</p>}
          <input
            style={styles.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            style={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button style={styles.button} onClick={handleAuth}>
            {isLogin ? 'Login' : 'Register'}
          </button>
          <p
            style={styles.link}
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'No account? Register' : 'Have account? Login'}
          </p>
        </div>
      </div>
    );
  }

  // Show tasks if logged in
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Tasks</h1>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>

      {message && <p style={styles.error}>{message}</p>}

      <div style={styles.card}>
        <div style={styles.row}>
          <input
            style={styles.input}
            type="text"
            placeholder="New task..."
            value={newTask}
            onChange={e => setNewTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createTask()}
          />
          <button style={styles.button} onClick={createTask}>Add</button>
        </div>
      </div>

      <div style={styles.card}>
        {tasks.length === 0 && <p>No tasks yet! Add one above.</p>}
        {tasks.map(task => (
          <div key={task.id} style={styles.taskRow}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => toggleTask(task)}
            />
            <span style={{
              ...styles.taskTitle,
              textDecoration: task.done ? 'line-through' : 'none',
              color: task.done ? '#888' : '#fff'
            }}>
              {task.title}
            </span>
            <button
              style={styles.deleteBtn}
              onClick={() => deleteTask(task.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    backgroundColor: '#1a1a2e',
    minHeight: '100vh',
    color: '#fff'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    color: '#e94560',
    fontSize: '2rem'
  },
  card: {
    backgroundColor: '#16213e',
    padding: '20px',
    borderRadius: '10px',
    marginBottom: '20px'
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #444',
    backgroundColor: '#0f3460',
    color: '#fff',
    fontSize: '1rem'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer'
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: '#444',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  error: {
    color: '#e94560',
    marginBottom: '10px'
  },
  link: {
    color: '#e94560',
    cursor: 'pointer',
    textAlign: 'center',
    marginTop: '10px'
  },
  row: {
    display: 'flex',
    gap: '10px'
  },
  taskRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 0',
    borderBottom: '1px solid #444'
  },
  taskTitle: {
    flex: 1,
    fontSize: '1rem'
  },
  deleteBtn: {
    padding: '5px 10px',
    backgroundColor: '#e94560',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

export default App;