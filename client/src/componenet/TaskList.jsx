import TaskItem from './TaskItem';

function TaskList({
  tasks,
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
    <div style={styles.card}>
      {tasks.length === 0 && <p>No tasks found!</p>}
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
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
      ))}
    </div>
  );
}

export default TaskList;