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

      {/* ADLC and TaskFlow Insight */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 350px', gap: 24, marginBottom: 24 }}>
        <div className="section" style={{ background: 'var(--bg2)', padding: '24px', borderRadius: 'var(--r2)', border: '1px solid var(--border)', margin: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--orange)' }}>What is the ADLC Approach?</h3>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12 }}>
            The <strong>AI Development Life Cycle (ADLC)</strong> pairs you with an AI agent (Claude Code) to shift your role from coder to <em>technical director</em>. You guide the architecture and business logic, while Claude handles the heavy lifting of boilerplate, syntax, and initial implementation.
          </p>
          <ul style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, paddingLeft: 20, marginBottom: 20 }}>
            <li style={{ marginBottom: 4 }}><strong>Accelerated Sprinting:</strong> Write natural language commands to generate complex features instantly.</li>
            <li style={{ marginBottom: 4 }}><strong>Automated Code Review:</strong> Leverage AI to catch security flaws, N+1 queries, and async bugs.</li>
            <li><strong>Continuous Iteration:</strong> Seamlessly integrate fixes and improvements without ever leaving your terminal.</li>
          </ul>

          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: 'var(--teal2)' }}>Building TaskFlow</h3>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6, marginBottom: 12 }}>
            <strong>TaskFlow</strong> is your capstone project—a production-ready Enterprise task management system. Designed to simulate real-world product requirements, you'll build it progressively across 10 labs, transitioning from simple core logic to highly complex AI integrations and automated operational workflows.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>
            By the end of this journey, you won't just have a functioning application; you will have a comprehensive understanding of how to orchestrate Model Context Protocol (MCP) servers, manage state across microservices, and deliver a modern GenAI-powered backend.
          </p>
        </div>

        <div className="section" style={{ background: 'rgba(168, 85, 247, 0.05)', padding: '24px', borderRadius: 'var(--r2)', border: '1px solid var(--purple)', margin: 0 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, color: 'var(--purple2)' }}>Your Learning Journey</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { p: '1', n: 'Ideation', l: 'Lab 1', c: 'var(--orange)' },
              { p: '2', n: 'Foundation', l: 'Labs 2-4', c: 'var(--blue2)' },
              { p: '3', n: 'QA & Review', l: 'Labs 5-6', c: 'var(--teal2)' },
              { p: '4', n: 'Optimization', l: 'Lab 7', c: 'var(--gold)' },
              { p: '5', n: 'Capstone', l: 'Labs 8-10', c: 'var(--purple2)' },
            ].map(f => (
              <div key={f.p} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: f.c, color: '#fff', display: 'flex', alignItems: 'center', justifyCenter: 'center', fontSize: 11, fontWeight: 800 }}>{f.p}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{f.n}</div>
                  <div style={{ fontSize: 11, color: 'var(--text3)' }}>{f.l}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, fontSize: 11, color: 'var(--text3)', fontStyle: 'italic' }}>
            💡 Complete each phase to unlock more advanced Claude capabilities.
          </div>
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

      {/* Learning Ideology */}
      <div className="section" style={{ borderTop: 'none' }}>
        <div className="section-title">The TaskFlow Learning Ideology</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {[
            { 
              t: '🔍 Pre-Checkpoint', s: 'Priming & Baseline', 
              p: 'Purpose: Test initial intuition and baseline knowledge.',
              a: 'Activity: Quick MCQs, matching, or bug-hunts to park curiosity.',
              bg: 'rgba(59, 130, 246, 0.05)', c: 'var(--blue2)'
            },
            { 
              t: '⚙️ Agentic Build', s: 'The Hand-on Lab', 
              p: 'Purpose: Execution of real-world SDLC tasks with Claude Code.',
              a: 'Activity: Guided agentic commands to build PRDs, ORM models, and APIs.',
              bg: 'rgba(255, 107, 53, 0.05)', c: 'var(--orange)'
            },
            { 
              t: '✅ Post-Checkpoint', s: 'Validation & Reflection', 
              p: 'Purpose: Verify technical correctness and cement learning.',
              a: 'Activity: Output checklists, timed mini-challenges, and self-assessments.',
              bg: 'rgba(34, 197, 94, 0.05)', c: 'var(--green)'
            },
            { 
              t: '🚀 Mastery', s: 'The Outcome', 
              p: 'Purpose: Ship a production-ready application and earn rank.',
              a: 'Activity: Accumulate XP to unlock elite badges (Novice → Master).',
              bg: 'rgba(245, 200, 66, 0.05)', c: 'var(--gold)'
            }
          ].map(i => (
            <div key={i.t} style={{ 
              background: i.bg, border: `1px solid ${i.c}40`, 
              borderRadius: 'var(--r2)', padding: '18px', 
              transition: 'transform 0.2s'
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: i.c, marginBottom: 4 }}>{i.t}</div>
              <div style={{ fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text3)', marginBottom: 12 }}>{i.s}</div>
              <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.5, marginBottom: 8 }}>{i.p}</p>
              <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.5 }}>{i.a}</p>
            </div>
          ))}
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
