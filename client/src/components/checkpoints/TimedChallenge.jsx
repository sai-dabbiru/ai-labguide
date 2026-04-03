import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';

function fmtTime(s) {
  return `${Math.floor(s / 60)}:${s % 60 < 10 ? '0' : ''}${s % 60}`;
}

export default function TimedChallenge({ labId, task, secs, criteria, maxScore = 20 }) {
  const { toggleCheck, progress, showToast, updateAutoScore } = useApp();
  const [rem, setRem] = useState(secs);
  const [running, setRunning] = useState(false);
  const timerRef = useRef(null);

  const checkedCount = criteria.filter((_, i) => !!progress[`mini-${labId}-${i}`]).length;

  // Auto-score from criteria completion
  useEffect(() => {
    const score = Math.round((checkedCount / criteria.length) * maxScore);
    updateAutoScore(labId, 'post', score);
  }, [checkedCount, criteria.length, labId, maxScore, updateAutoScore]);

  const start = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setRem(secs);
    setRunning(true);
    showToast('', `Timer started — ${Math.floor(secs / 60)} minutes!`);
    timerRef.current = setInterval(() => {
      setRem(r => {
        if (r <= 1) {
          clearInterval(timerRef.current);
          setRunning(false);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
  };

  const pct = Math.max(0, (rem / secs) * 100);
  const isUp = rem === 0;

  return (
    <div>
      <p style={{ marginBottom: 12 }}>{task}</p>
      <div className="mini-box">
        {/* Score bar */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
          padding: '6px 0'
        }}>
          <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Criteria Met</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>{checkedCount}/{criteria.length}</span>
          <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700, marginLeft: 'auto' }}>
            {Math.round((checkedCount / criteria.length) * maxScore)} XP
          </span>
        </div>

        <div className="timer-track">
          <div
            className="timer-fill"
            style={{
              width: `${pct}%`,
              background: isUp ? 'var(--red)' : undefined,
              transition: running ? 'width 1s linear' : 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <button className="btn btn-te" onClick={start}>
            {running ? 'Restart Timer' : 'Start Timer'}
          </button>
          <span style={{ fontSize: 13, fontWeight: 600, color: isUp ? 'var(--red)' : 'var(--text3)' }}>
            {isUp ? "Time's up! Self-assess below." : `${fmtTime(rem)} remaining`}
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 10 }}>Check each criterion you completed:</div>
        <ul className="cl">
          {criteria.map((c, i) => {
            const key = `mini-${labId}-${i}`;
            const done = !!progress[key];
            return (
              <li key={i} className={done ? 'done' : ''} onClick={() => toggleCheck(key)}>
                <div className="cb">{done ? '✓' : ''}</div>
                {c}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
