function TaskItem({
  task,
  editingId,
  editText,
  setEditText,
  toggleTask,
  startEdit,
  cancelEdit,
  saveEdit,
  updatePriority,
  deleteTask,
  priorityColor,
  styles
}) {
  return (
    <div style={styles.taskRow}>
      <input type="checkbox" checked={task.done} onChange={() => toggleTask(task)} />
      {editingId === task.id ? (
        <>
          <input
            style={{...styles.input, marginBottom: 0, width: 'auto', flex: 1}}
            type="text"
            value={editText}
            onChange={e => setEditText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && saveEdit(task)}
            autoFocus
          />
          <button style={styles.addBtn} onClick={() => saveEdit(task)}>Save</button>
          <button style={styles.logoutBtn} onClick={cancelEdit}>Cancel</button>
        </>
      ) : (
        <>
          <span
            style={{...styles.taskTitle, textDecoration: task.done ? 'line-through' : 'none', color: task.done ? '#888' : '#fff'}}
            onDoubleClick={() => startEdit(task)}
          >
            {task.title}
          </span>
          <select
            value={task.priority}
            onChange={e => updatePriority(task, e.target.value)}
            style={{...styles.badge, backgroundColor: priorityColor(task.priority), border: 'none', cursor: 'pointer'}}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button style={styles.addBtn} onClick={() => startEdit(task)}>Edit</button>
          <button style={styles.deleteBtn} onClick={() => deleteTask(task.id)}>Delete</button>
        </>
      )}
    </div>
  );
}

export default TaskItem;