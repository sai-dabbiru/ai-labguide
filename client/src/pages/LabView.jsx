import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LABS, SMETA, SICON } from '../data/labs.js';
import MCQ from '../components/checkpoints/MCQ.jsx';
import MatchExercise from '../components/checkpoints/MatchExercise.jsx';
import BugHunt from '../components/checkpoints/BugHunt.jsx';
import FillInBlank from '../components/checkpoints/FillInBlank.jsx';
import Reflection from '../components/checkpoints/Reflection.jsx';
import OutputChecklist from '../components/checkpoints/OutputChecklist.jsx';
import TimedChallenge from '../components/checkpoints/TimedChallenge.jsx';

function copyToClipboard(text, showToast) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('', 'Copied to clipboard!'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showToast('', 'Copied!'); } catch { showToast('', 'Copy: Ctrl+C'); }
    document.body.removeChild(ta);
  }
}

function PreCheckpoint({ lab }) {
  const p = lab.pre;
  let inner;
  if (p.type === 'mcq') inner = <MCQ labId={lab.id} qs={p.qs} prefix="pre" maxScore={20} />;
  else if (p.type === 'match') inner = <MatchExercise labId={lab.id} pairs={p.pairs} prefix="pre" maxScore={20} />;
  else if (p.type === 'bug') inner = <BugHunt labId={lab.id} lines={p.lines} bugs={p.bugs} explains={p.explains} prefix="pre" maxScore={20} />;
  else if (p.type === 'fillin') inner = <FillInBlank labId={lab.id} lines={p.lines} prefix="pre" maxScore={20} />;
  else if (p.type === 'reflection') inner = <Reflection labId={lab.id} qs={p.qs} prefix="pre" maxScore={20} />;

  return (
    <div className="cp cp-pre">
      <div className="cp-tag ct-pre">◎ Pre-Checkpoint</div>
      <div className="cp-xpbadge">up to 20 XP</div>
      <h4>{p.title}</h4>
      {inner}
    </div>
  );
}

function PostCheckpoint({ lab }) {
  const p = lab.post;
  let inner;
  if (p.type === 'output') inner = <OutputChecklist labId={lab.id} steps={p.steps} maxScore={20} />;
  else if (p.type === 'mini') inner = <TimedChallenge labId={lab.id} task={p.task} secs={p.secs} criteria={p.criteria} maxScore={20} />;
  else if (p.type === 'reflection') inner = <Reflection labId={lab.id} qs={p.qs} prefix="post" maxScore={20} />;

  return (
    <div className="cp cp-post">
      <div className="cp-tag ct-post">◉ Post-Checkpoint</div>
      <div className="cp-xpbadge">up to 20 XP</div>
      <h4>{p.title}</h4>
      {inner}
    </div>
  );
}

function BonusSection({ lab }) {
  const { claimBonus, showToast, scores } = useApp();
  const s = scores[lab.id] || {};
  const claimed = (s.bonus || 0) >= 30;
  return (
    <div className="cp cp-bonus">
      <div className="cp-tag ct-bonus">★ Bonus Easter Egg</div>
      <div className="cp-xpbadge">{claimed ? '✓ 30 XP' : 'up to 30 XP'}</div>
      <h4>Secret Claude Code Command</h4>
      <p>Run this command in your Claude Code session to unlock the bonus challenge:</p>
      <div className="egg">
        <div className="egg-tag">Claude Code Command — click to copy</div>
        <div className="egg-cmd" onClick={() => copyToClipboard(lab.bonus.cmd, showToast)}>{lab.bonus.cmd}</div>
        <div className="egg-mission">
          <div className="ml">Your Mission</div>
          <p>{lab.bonus.mission}</p>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <button className={`btn ${claimed ? 'btn-gh' : 'btn-go'}`} onClick={() => claimBonus(lab.id)} disabled={claimed}>
          {claimed ? '✓ Bonus Claimed' : 'Claim +30 Bonus XP'}
        </button>
      </div>
    </div>
  );
}

function ExerciseCard({ labId, ex }) {
  const { showToast } = useApp();
  return (
    <div className="ex">
      <div className="ex-label">
        <span className="ex-num">Exercise {ex.id}</span>
        <h4>{ex.title}</h4>
      </div>
      <p>{ex.desc}</p>
      <div className="code-block">{ex.cmd}</div>
      <button className="btn btn-gh" style={{ marginTop: 10 }} onClick={() => copyToClipboard(ex.cmd, showToast)}>
        Copy Command
      </button>
    </div>
  );
}

function LabChecklist({ lab }) {
  const { toggleCheck, progress, updateAutoScore } = useApp();
  const checkedCount = lab.checklist.filter((_, i) => !!progress[`cl-${lab.id}-${i}`]).length;

  // Auto-score exercises section from checklist completion
  useEffect(() => {
    const score = Math.round((checkedCount / lab.checklist.length) * lab.base);
    updateAutoScore(lab.id, 'ex', score);
  }, [checkedCount, lab.checklist.length, lab.base, lab.id, updateAutoScore]);

  return (
    <div className="cl-box">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div className="cl-title" style={{ marginBottom: 0 }}>Lab Completion Checklist</div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)' }}>
          {Math.round((checkedCount / lab.checklist.length) * lab.base)} / {lab.base} XP
        </span>
      </div>
      <div style={{
        height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden', marginBottom: 12
      }}>
        <div style={{
          width: `${(checkedCount / lab.checklist.length) * 100}%`, height: '100%',
          background: 'linear-gradient(90deg, var(--green), var(--teal))',
          borderRadius: 2, transition: 'width .4s ease'
        }} />
      </div>
      <ul className="cl">
        {lab.checklist.map((item, i) => {
          const key = `cl-${lab.id}-${i}`;
          const done = !!progress[key];
          return (
            <li key={i} className={done ? 'done' : ''} onClick={() => toggleCheck(key)}>
              <div className="cb">{done ? '✓' : ''}</div>
              {item}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ExpectedOutputSection({ imageUrl }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ marginTop: 14 }}>
      <button 
        className="btn btn-te" 
        onClick={() => setShow(!show)}
        style={{ marginBottom: show ? 12 : 0 }}
      >
        {show ? 'Hide Expected Output' : 'View Expected Reference Output →'}
      </button>
      {show && (
        <div style={{ 
          background: 'var(--card)', 
          border: '1px solid var(--border)', 
          borderRadius: 'var(--r2)', 
          padding: '10px',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <img 
            src={imageUrl} 
            alt="Expected Output Reference" 
            style={{ width: '100%', borderRadius: 'var(--r)', display: 'block' }} 
          />
          <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 8, textAlign: 'center' }}>
            💡 Use this as a visual guide for your Claude-generated work.
          </div>
        </div>
      )}
    </div>
  );
}

// ── Score Summary Card ──────────────────────────────────────────────────────
function ScoreSummary({ lab }) {
  const { scores } = useApp();
  const s = scores[lab.id] || { pre: 0, ex: 0, post: 0, bonus: 0, total: 0 };
  const maxXP = lab.base + 70;
  const pct = Math.min(100, ((s.total || 0) / maxXP) * 100);

  const sections = [
    { label: 'Pre-Checkpoint', value: s.pre || 0, max: 20, color: 'var(--blue2)' },
    { label: 'Exercises', value: s.ex || 0, max: lab.base, color: 'var(--orange)' },
    { label: 'Post-Checkpoint', value: s.post || 0, max: 20, color: 'var(--teal2)' },
    { label: 'Bonus', value: s.bonus || 0, max: 30, color: 'var(--gold)' },
  ];

  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--border)',
      borderRadius: 'var(--r2)', padding: '22px 26px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>
          📊 Auto-Scored Results
        </h4>
        <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--gold)' }}>
          {s.total || 0} <span style={{ fontSize: 12, color: 'var(--text3)', fontWeight: 400 }}>/ {maxXP} XP</span>
        </span>
      </div>

      {/* Overall progress bar */}
      <div style={{
        height: 8, background: 'var(--bg3)', borderRadius: 4,
        overflow: 'hidden', marginBottom: 20
      }}>
        <div style={{
          width: `${pct}%`, height: '100%',
          background: pct >= 100 ? 'linear-gradient(90deg, var(--gold), var(--orange))'
            : 'linear-gradient(90deg, var(--teal), var(--blue))',
          borderRadius: 4, transition: 'width .5s ease'
        }} />
      </div>

      {/* Section breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {sections.map(({ label, value, max, color }) => (
          <div key={label} style={{
            background: 'var(--bg3)', borderRadius: 8, padding: '10px 14px',
            border: value >= max ? `1px solid ${color}` : '1px solid var(--border)',
            transition: 'border-color .3s'
          }}>
            <div style={{ fontSize: 9, color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 4 }}>{label}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color }}>
              {value}
              <span style={{ fontSize: 10, color: 'var(--text3)', fontWeight: 400 }}>/{max}</span>
            </div>
            <div style={{
              height: 3, background: 'var(--border)', borderRadius: 2,
              overflow: 'hidden', marginTop: 6
            }}>
              <div style={{
                width: `${max > 0 ? (value / max) * 100 : 0}%`, height: '100%',
                background: color, borderRadius: 2, transition: 'width .4s ease'
              }} />
            </div>
            {value >= max && (
              <div style={{ fontSize: 9, color: 'var(--green)', fontWeight: 700, marginTop: 4 }}>
                ✓ MAX
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LabView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const lab = LABS.find(l => l.id === parseInt(id));

  // Scroll to top on lab change
  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!lab) return <div style={{ padding: 44 }}>Lab not found</div>;

  const sclass = { easy: 'sb-easy', hard: 'sb-hard', boss: 'sb-boss', final: 'sb-final' }[lab.sprint];
  const sdesc = {
    easy: 'Recovery sprint — breathe, build, consolidate.',
    hard: 'Hard sprint — push your limits.',
    boss: 'Boss sprint — maximum intensity.',
    final: 'Final capstone — everything you\'ve learned.',
  }[lab.sprint];
  const dclass = { easy: 'd-easy', hard: 'd-hard', boss: 'd-boss', final: 'd-final' }[lab.sprint];
  const maxXP = lab.base + 70;

  return (
    <div className="lab-page">
      <div className={`sprint-bar ${sclass}`}>
        {SICON[lab.sprint]} {SMETA[lab.sprint]} — {sdesc}
      </div>

      <div className="lab-hdr">
        <div className="lab-hdr-l">
          <div className="ln">Lab {String(lab.id).padStart(2, '0')} — {lab.stack}</div>
          <h2>{lab.title}</h2>
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 10 }}>
            <span className="pill p-or">⏱ {lab.dur}</span>
            <span className={`dpill ${dclass}`} style={{ padding: '4px 10px', borderRadius: 10 }}>{SMETA[lab.sprint]}</span>
          </div>
        </div>
        <div className="lab-hdr-r">
          <div className="xp-big">{maxXP}</div>
          <div className="xp-lbl">max XP</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 4 }}>{lab.base} base + 70 bonus</div>
        </div>
      </div>

      <div className="feat-row">
        {lab.feats.map(f => <span key={f} className="fb">{f}</span>)}
      </div>

      <div className="div" />
      <PreCheckpoint lab={lab} />
      <div className="div" />

      <h3 style={{ fontSize: 11, color: 'var(--text3)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 14 }}>Exercises</h3>
      {lab.exs.map(ex => <ExerciseCard key={ex.id} labId={lab.id} ex={ex} />)}

      {lab.expectedOutputImage && (
        <ExpectedOutputSection imageUrl={lab.expectedOutputImage} />
      )}

      <div className="div" />
      <PostCheckpoint lab={lab} />
      <div className="div" />
      <BonusSection lab={lab} />
      <div className="div" />
      <LabChecklist lab={lab} />

      <div className="div" />
      <ScoreSummary lab={lab} />

      <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
        {lab.id > 1 && (
          <button className="btn btn-gh" onClick={() => navigate(`/lab/${lab.id - 1}`)}>
            ← Lab {lab.id - 1}
          </button>
        )}
        <button className="btn btn-or" onClick={() => navigate('/scoreboard')}>
          View Scoreboard →
        </button>
        {lab.id < 10 && (
          <button className="btn btn-gh" onClick={() => navigate(`/lab/${lab.id + 1}`)}>
            Lab {lab.id + 1} →
          </button>
        )}
      </div>
    </div>
  );
}
