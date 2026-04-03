import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

export default function LoginPage() {
  const { login } = useApp();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    if (!username.trim() || username.trim().length < 2) {
      setError('Enter at least 2 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await login(username.trim());
    } catch (err) {
      setError(err.message || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">⚡</div>
        <h1>Claude Code<br /><span style={{ color: 'var(--orange)' }}>Lab Guide</span></h1>
        <p>ADLC Python Edition · 10 Labs · 1450 XP</p>
        <form onSubmit={handle}>
          <input
            className="login-input"
            type="text"
            placeholder="Enter your name to begin..."
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
            disabled={loading}
          />
          {error && (
            <p style={{ color: 'var(--red)', fontSize: 12, marginBottom: 10 }}>{error}</p>
          )}
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Loading...' : 'Start Learning →'}
          </button>
        </form>
        <p className="login-note">Progress is saved to server — log in from any device with the same name.</p>
        <div style={{ marginTop: 20, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
          <span className="pill p-or">FastAPI 0.111</span>
          <span className="pill p-te">SQLAlchemy 2.0</span>
          <span className="pill p-pu">Claude Code</span>
          <span className="pill p-go">1450 XP</span>
          <span className="pill p-bl">10 Labs</span>
        </div>
      </div>
    </div>
  );
}
