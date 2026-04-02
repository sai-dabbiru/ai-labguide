import { useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LABS, SMETA, STACK_COMMANDS } from '../data/labs.js';
import { useNavigate, useParams } from 'react-router-dom';

function pad(n) { return n < 10 ? '0' + n : String(n); }

export function FeaturesPage() {
  const navigate = useNavigate();
  return (
    <div className="ref-page">
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Claude Features × Lab Mapping</h2>
      <p style={{ color: 'var(--text2)', marginBottom: 22, fontSize: 14 }}>Every lab teaches specific Claude Code capabilities.</p>
      <div style={{ overflowX: 'auto' }}>
        <table className="rt">
          <thead>
            <tr><th>Lab</th><th>Title</th><th>Claude Features</th><th>Stack Output</th></tr>
          </thead>
          <tbody>
            {LABS.map(lab => (
              <tr key={lab.id} onClick={() => navigate(`/lab/${lab.id}`)} style={{ cursor: 'pointer' }}>
                <td>{pad(lab.id)}</td>
                <td>{lab.title}</td>
                <td>{lab.feats.map(f => <span key={f} className="fb" style={{ marginRight: 4 }}>{f}</span>)}</td>
                <td>{lab.stack}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function CommandsPage() {
  return (
    <div className="ref-page">
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Python Stack Quick Reference</h2>
      <p style={{ color: 'var(--text2)', marginBottom: 22, fontSize: 14 }}>Common commands used across all TaskFlow labs.</p>
      <table className="rt">
        <thead>
          <tr><th>Task</th><th>Command</th></tr>
        </thead>
        <tbody>
          {STACK_COMMANDS.map(([task, cmd], i) => (
            <tr key={i}>
              <td>{task}</td>
              <td style={{ fontFamily: 'var(--fm)', fontSize: 12, color: 'var(--teal2)' }}>{cmd}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ScoreboardPage() {
  const { scores, resetScores } = useApp();
  const navigate = useNavigate();

  const grandTotal = LABS.reduce((sum, lab) => sum + ((scores[lab.id] || {}).total || 0), 0);

  return (
    <div className="ref-page">
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>📊 Auto-Scored Scoreboard</h2>
      <p style={{ color: 'var(--text2)', marginBottom: 22, fontSize: 14 }}>
        Scores are <strong style={{ color: 'var(--teal2)' }}>automatically calculated</strong> as you complete exercises, quizzes, and checklists in each lab.
      </p>

      {/* Grand total card */}
      <div style={{
        background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 'var(--r2)',
        padding: '18px 24px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 20
      }}>
        <div>
          <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Grand Total</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: 'var(--gold)' }}>{grandTotal}</div>
          <div style={{ fontSize: 11, color: 'var(--text3)' }}>of 1450 XP</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ height: 8, background: 'var(--bg3)', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, (grandTotal / 1450) * 100)}%`, height: '100%',
              background: 'linear-gradient(90deg, var(--gold), var(--orange))',
              borderRadius: 4, transition: 'width .5s ease'
            }} />
          </div>
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
            {Math.round((grandTotal / 1450) * 100)}% complete
          </div>
        </div>
      </div>

      <div className="score-wrap">
        <table className="st">
          <thead>
            <tr>
              <th>Lab</th><th>Title</th><th>Difficulty</th>
              <th>Pre /20</th><th>Exercises</th><th>Post /20</th>
              <th>Bonus /30</th><th>Total</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {LABS.map((lab, i) => {
              const s = scores[lab.id] || { pre: 0, ex: 0, post: 0, bonus: 0, total: 0 };
              const dclass = { easy: 'd-easy', hard: 'd-hard', boss: 'd-boss', final: 'd-final' }[lab.sprint];
              const maxXP = lab.base + 70;
              const done = (s.total || 0) >= Math.floor(maxXP * 0.5);
              const started = (s.total || 0) > 0;
              const status = done ? 'done' : started ? 'act' : 'lock';
              const stClass = { done: 'sp-done', act: 'sp-act', lock: 'sp-lock' }[status];
              const stLabel = { done: 'Complete', act: 'In Progress', lock: 'Not Started' }[status];

              return (
                <tr key={lab.id} onClick={() => navigate(`/lab/${lab.id}`)} style={{ cursor: 'pointer' }}>
                  <td style={{ color: 'var(--orange)' }}>{pad(lab.id)}</td>
                  <td>{lab.title}</td>
                  <td><span className={`dpill ${dclass}`}>{SMETA[lab.sprint]}</span></td>
                  <td>
                    <span style={{ color: (s.pre || 0) > 0 ? 'var(--blue2)' : 'var(--text3)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {s.pre || 0}
                    </span>
                    <span className="xm">/20</span>
                  </td>
                  <td>
                    <span style={{ color: (s.ex || 0) > 0 ? 'var(--orange)' : 'var(--text3)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {s.ex || 0}
                    </span>
                    <span className="xm">/{lab.base}</span>
                  </td>
                  <td>
                    <span style={{ color: (s.post || 0) > 0 ? 'var(--teal2)' : 'var(--text3)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {s.post || 0}
                    </span>
                    <span className="xm">/20</span>
                  </td>
                  <td>
                    <span style={{ color: (s.bonus || 0) > 0 ? 'var(--gold)' : 'var(--text3)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {s.bonus || 0}
                    </span>
                    <span className="xm">/30</span>
                  </td>
                  <td className="row-tot">{s.total || 0}</td>
                  <td><span className={`sp ${stClass}`}>{stLabel}</span></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-gh" onClick={resetScores}>Reset All</button>
        <span style={{ fontSize: 12, color: 'var(--text3)' }}>
          Grand Total: <strong style={{ color: 'var(--gold)' }}>{grandTotal}</strong> / 1450 XP
        </span>
        <span style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 'auto' }}>
          💡 Scores update automatically as you complete lab exercises
        </span>
      </div>
    </div>
  );
}
