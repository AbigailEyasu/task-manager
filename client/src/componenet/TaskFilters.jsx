function TaskFilters({ filter, setFilter, styles }) {
  return (
    <div style={styles.filterRow}>
      {['all', 'active', 'completed', 'High', 'Medium', 'Low'].map(f => (
        <button
          key={f}
          style={{...styles.filterBtn, backgroundColor: filter === f ? '#e94560' : '#16213e'}}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

export default TaskFilters;