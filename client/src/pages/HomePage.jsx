import { useApp } from '../context/AppContext.jsx';
import { LABS, BADGES } from '../data/labs.js';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { stats, scores } = useApp();
  const navigate = useNavigate();
  const { xp, labsDone, bonusCount, badge } = stats;

  return (
    <>
      {/* Hero */}
      <div className="hero">
        <div className="htag">Claude Code · ADLC · Python Stack</div>
        <h1>Build <em>TaskFlow</em><br />with Claude Code.</h1>
        <p>10 hands-on labs. FastAPI · SQLAlchemy · Pytest. Earn XP, unlock badges, and ship a real product using AI-assisted development.</p>
        <div className="pills">
          <span className="pill p-or">FastAPI 0.111</span>
          <span className="pill p-te">SQLAlchemy 2.0</span>
          <span className="pill p-pu">Claude Code</span>
          <span className="pill p-go">1450 XP Available</span>
          <span className="pill p-bl">10 Labs · ~10 hrs</span>
        </div>
        <div className="btns">
          <button className="btn btn-or" onClick={() => navigate('/lab/1')}>Start Lab 01 →</button>
          <button className="btn btn-gh" onClick={() => navigate('/scoreboard')}>Scoreboard</button>
        </div>
      </div>

      {/* Dashboard cards */}
      <div className="dash">
        <div className="dc">
          <div className="dl">Total XP Earned</div>
          <div className="dv c-go">{xp}</div>
          <div className="ds">of 1450 possible</div>
        </div>
        <div className="dc">
          <div className="dl">Labs Completed</div>
          <div className="dv c-te">{labsDone}</div>
          <div className="ds">of 10 labs</div>
        </div>
        <div className="dc">
          <div className="dl">Current Badge</div>
          <div className="dv c-pu" style={{ fontSize: 15, lineHeight: 1.5 }}>
            {badge ? badge.name : '—'}
          </div>
          <div className="ds">{badge ? badge.title : 'Complete Lab 01 first'}</div>
        </div>
        <div className="dc">
          <div className="dl">Bonus Challenges</div>
          <div className="dv c-or">{bonusCount}</div>
          <div className="ds">of 10 unlocked</div>
        </div>
      </div>

      {/* Badge wall */}
      <div className="section">
        <div className="section-title">Badge Collection</div>
        <div className="badge-grid">
          {BADGES.map(b => {
            const unlocked = xp >= b.xp;
            return (
              <div key={b.id} className={`badge-card ${unlocked ? 'unlocked' : 'locked'}`}>
                <div className="b-icon" style={{ background: b.bg }}>{b.icon}</div>
                <div>
                  <div className="b-name">{b.name}</div>
                  <div className="b-req">{b.xp} XP required</div>
                  <div className="b-title">{b.title}</div>
                  {unlocked && <div className="b-un">Unlocked ✓</div>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Lab overview */}
      <div className="section">
        <div className="section-title">All Labs</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
          {LABS.map(lab => {
            const s = scores[lab.id] || {};
            const done = (s.total || 0) >= Math.floor(lab.base * 0.5);
            const dclass = { easy: 'd-easy', hard: 'd-hard', boss: 'd-boss', final: 'd-final' }[lab.sprint];
            return (
              <div
                key={lab.id}
                className="dc"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/lab/${lab.id}`)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ fontSize: 9, color: 'var(--text3)' }}>Lab {String(lab.id).padStart(2, '0')}</div>
                  <span className={`dpill ${dclass}`}>{lab.sprint}</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{lab.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginBottom: 8 }}>{lab.stack}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 12, color: 'var(--gold)', fontWeight: 700 }}>{s.total || 0} / {lab.base + 70} XP</span>
                  {done ? <span className="sp sp-done">Done ✓</span> : <span className="sp sp-lock">{lab.base} XP</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
