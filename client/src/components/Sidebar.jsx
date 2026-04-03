import { useApp } from '../context/AppContext.jsx';
import { LABS, SMETA, SICON } from '../data/labs.js';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { stats, scores, theme, toggleTheme, logout, user } = useApp();
  const { xp, badge } = stats;
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sidebar">
      <div className="s-logo">
        <div className="tag">Claude Code · ADLC</div>
        <h2>Lab Guide<br />Python Edition</h2>
      </div>

      {/* XP Widget */}
      <div className="xp-widget">
        <div className="lbl">Total XP</div>
        <div><span className="val">{xp}</span> <span className="sub">/ 1450</span></div>
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${Math.min(100, xp / 14.5)}%` }} />
        </div>
        <div className="badge-pill">
          <div className="badge-dot" style={{ background: badge ? badge.c : 'var(--gold)' }} />
          <span>{badge ? badge.name : 'No badge yet'}</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="nav-sec">Navigation</div>
      <button className={`nav-a ${isActive('/') ? 'active' : ''}`} onClick={() => navigate('/')}>
        <span className="nav-num">⌂</span> Dashboard
      </button>

      <div className="nav-sec">Labs</div>
      {LABS.map(lab => {
        const s = scores[lab.id] || {};
        const done = (s.total || 0) >= Math.floor(lab.base * 0.5);
        const dclass = { easy: 'd-easy', hard: 'd-hard', boss: 'd-boss', final: 'd-final' }[lab.sprint];
        const active = isActive(`/lab/${lab.id}`);
        return (
          <button
            key={lab.id}
            className={`nav-a ${active ? 'active' : ''}`}
            onClick={() => navigate(`/lab/${lab.id}`)}
          >
            <span className="nav-num" style={{ fontSize: 9 }}>{String(lab.id).padStart(2, '0')}</span>
            <span style={{ flex: 1, fontSize: 12, textAlign: 'left' }}>{lab.title}</span>
            <span className={`dpill ${dclass}`}>{SICON[lab.sprint]}</span>
            {done
              ? <span className="nav-done">✓</span>
              : <span className="nav-xp">{lab.base}</span>
            }
          </button>
        );
      })}

      <div className="nav-sec" style={{ marginTop: 6 }}>Reference</div>
      <button className={`nav-a ${isActive('/features') ? 'active' : ''}`} onClick={() => navigate('/features')}>
        <span className="nav-num">◈</span> Features Map
      </button>
      <button className={`nav-a ${isActive('/commands') ? 'active' : ''}`} onClick={() => navigate('/commands')}>
        <span className="nav-num">◉</span> Stack Commands
      </button>
      <button className={`nav-a ${isActive('/scoreboard') ? 'active' : ''}`} onClick={() => navigate('/scoreboard')}>
        <span className="nav-num">◎</span> Scoreboard
      </button>

      {/* Bottom Toolbar */}
      <div style={{ marginTop: 'auto', padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {user && (
          <div style={{ fontSize: 10, color: 'var(--text3)', marginBottom: 4 }}>
            Signed in as <strong style={{ color: 'var(--text2)' }}>{user.username}</strong>
          </div>
        )}
        <button className="theme-btn" onClick={toggleTheme}>
          <span style={{ fontSize: 15 }}>{theme === 'dark' ? '☀️' : '🌙'}</span>
          <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        <button className="theme-btn" onClick={logout} style={{ color: 'var(--red)', borderColor: 'rgba(239,68,68,.25)' }}>
          <span>⎋</span> Sign Out
        </button>
      </div>
    </nav>
  );
}
