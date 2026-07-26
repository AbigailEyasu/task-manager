import { useState, useEffect } from 'react'
import LoginForm from './components/LoginForm';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import TaskList from './components/TaskList';
function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [filter, setFilter] = useState('all');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const API = 'http://localhost:3000';

  useEffect(() => {
    if (token) fetchTasks();
  }, [token, filter]);

  const fetchTasks = async () => {
    try {
      let url = `${API}/tasks`;
      if (filter === 'completed') url += '?done=true';
      if (filter === 'active') url += '?done=false';
      if (filter === 'High') url += '?priority=High';
      if (filter === 'Medium') url += '?priority=Medium';
      if (filter === 'Low') url += '?priority=Low';
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setTasks(data);
      else setMessage('Failed to fetch tasks');
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title: newTask, priority })
      });
      const data = await res.json();
      if (!res.ok) {
      setMessage(data.error || 'Failed to create task');
      return;
    }
      setTasks([data, ...tasks]);
      setNewTask('');
      setPriority('Medium');
    } catch (err) {
      setMessage('Failed to create task');
    }
  };
const startEdit = (task) => {
  setEditingId(task.id);
  setEditText(task.title);
};

const cancelEdit = () => {
  setEditingId(null);
  setEditText('');
};

const saveEdit = async (task) => {
  if (!editText.trim()) return;
  try {
    const res = await fetch(`${API}/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: editText })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Failed to update task');
      return;
    }
    setTasks(tasks.map(t => t.id === task.id ? data : t));
    cancelEdit();
  } catch (err) {
    setMessage('Failed to update task');
  }
};

const updatePriority = async (task, newPriority) => {
  try {
    const res = await fetch(`${API}/tasks/${task.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ priority: newPriority })
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Failed to update priority');
      return;
    }
    setTasks(tasks.map(t => t.id === task.id ? data : t));
  } catch (err) {
    setMessage('Failed to update priority');
  }
};

  const toggleTask = async (task) => {
    try {
      const res = await fetch(`${API}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ done: !task.done })
      });
      const data = await res.json();
       if (!res.ok) {
      setMessage(data.error || 'Failed to update task');
      return;
    }
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

  const priorityColor = (p) => {
    if (p === 'High') return '#e94560';
    if (p === 'Medium') return '#f0a500';
    return '#4caf50';
  };

 if (!token) {
  return (
    <LoginForm
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      isLogin={isLogin}
      setIsLogin={setIsLogin}
      message={message}
      handleAuth={handleAuth}
      styles={styles}
    />
  );
}

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Tasks</h1>
        <button style={styles.logoutBtn} onClick={logout}>Logout</button>
      </div>
      {message && <p style={styles.error}>{message}</p>}
      <div style={styles.card}>
        <div style={styles.row}>
          <input style={{...styles.input, marginBottom: 0}} type="text" placeholder="New task..." value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && createTask()} />
          <select style={styles.select} value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="High">🔴 High</option>
            <option value="Medium">🟡 Medium</option>
            <option value="Low">🟢 Low</option>
          </select>
          <button style={styles.addBtn} onClick={createTask}>Add</button>
        </div>
      </div>
      <div style={styles.filterRow}>
        {['all', 'active', 'completed', 'High', 'Medium', 'Low'].map(f => (
          <button key={f} style={{...styles.filterBtn, backgroundColor: filter === f ? '#e94560' : '#16213e'}} onClick={() => setFilter(f)}>{f}</button>
        ))}
      </div>
    <TaskList
  tasks={tasks}
  editingId={editingId}
  editText={editText}
  setEditText={setEditText}
  toggleTask={toggleTask}
  startEdit={startEdit}
  cancelEdit={cancelEdit}
  saveEdit={saveEdit}
  updatePriority={updatePriority}
  deleteTask={deleteTask}
  priorityColor={priorityColor}
  styles={styles}
/>
    </div>
  );
}

const styles = {
  container: { maxWidth: '650px', margin: '0 auto', padding: '20px', fontFamily: 'Arial', backgroundColor: '#1a1a2e', minHeight: '100vh', color: '#fff' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#e94560', fontSize: '2rem' },
  card: { backgroundColor: '#16213e', padding: '20px', borderRadius: '10px', marginBottom: '15px' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#0f3460', color: '#fff', fontSize: '1rem' },
  select: { padding: '10px', borderRadius: '5px', border: '1px solid #444', backgroundColor: '#0f3460', color: '#fff', fontSize: '1rem', marginLeft: '10px' },
  button: { width: '100%', padding: '10px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '5px', fontSize: '1rem', cursor: 'pointer' },
  addBtn: { padding: '10px 20px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', marginLeft: '10px' },
  logoutBtn: { padding: '8px 16px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  error: { color: '#e94560' },
  link: { color: '#e94560', cursor: 'pointer', textAlign: 'center', marginTop: '10px' },
  row: { display: 'flex', alignItems: 'center', gap: '5px' },
  filterRow: { display: 'flex', gap: '8px', marginBottom: '15px', flexWrap: 'wrap' },
  filterBtn: { padding: '6px 12px', border: 'none', borderRadius: '5px', color: '#fff', cursor: 'pointer', fontSize: '0.85rem' },
  taskRow: { display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid #444' },
  taskTitle: { flex: 1, fontSize: '1rem' },
  badge: { padding: '3px 8px', borderRadius: '10px', fontSize: '0.75rem', color: '#fff' },
  deleteBtn: { padding: '5px 10px', backgroundColor: '#e94560', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }
};

export default App;