function TaskForm({ newTask, setNewTask, priority, setPriority, createTask, styles }) {
  return (
    <div style={styles.card}>
      <div style={styles.row}>
        <input
          style={{...styles.input, marginBottom: 0}}
          type="text"
          placeholder="New task..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && createTask()}
        />
        <select style={styles.select} value={priority} onChange={e => setPriority(e.target.value)}>
          <option value="High">🔴 High</option>
          <option value="Medium">🟡 Medium</option>
          <option value="Low">🟢 Low</option>
        </select>
        <button style={styles.addBtn} onClick={createTask}>Add</button>
      </div>
    </div>
  );
}

export default TaskForm;