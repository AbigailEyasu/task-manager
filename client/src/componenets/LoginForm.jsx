function LoginForm({ email, setEmail, password, setPassword, isLogin, setIsLogin, message, handleAuth, styles }) {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Task Manager</h1>
      <div style={styles.card}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        {message && <p style={styles.error}>{message}</p>}
        <input style={styles.input} type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input style={styles.input} type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button style={styles.button} onClick={handleAuth}>{isLogin ? 'Login' : 'Register'}</button>
        <p style={styles.link} onClick={() => setIsLogin(!isLogin)}>{isLogin ? 'No account? Register' : 'Have account? Login'}</p>
      </div>
    </div>
  );
}

export default LoginForm;