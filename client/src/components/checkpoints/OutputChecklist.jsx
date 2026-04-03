import { useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';

export default function OutputChecklist({ labId, steps, maxScore = 20 }) {
  const { toggleCheck, progress, updateAutoScore } = useApp();

  const checkedCount = steps.filter((_, i) => !!progress[`out-${labId}-${i}`]).length;

  // Auto-score
  useEffect(() => {
    const score = Math.round((checkedCount / steps.length) * maxScore);
    updateAutoScore(labId, 'post', score);
  }, [checkedCount, steps.length, labId, maxScore, updateAutoScore]);

  return (
    <div>
      {/* Score bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
        padding: '8px 14px', background: 'var(--bg3)', borderRadius: 8,
        border: '1px solid var(--border)'
      }}>
        <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Verified</span>
        <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${(checkedCount / steps.length) * 100}%`, height: '100%',
            background: 'linear-gradient(90deg, var(--teal), var(--green))',
            borderRadius: 2, transition: 'width .4s ease'
          }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>{checkedCount}/{steps.length}</span>
        <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>
          {Math.round((checkedCount / steps.length) * maxScore)} XP
        </span>
      </div>

      <p style={{ marginBottom: 10 }}>Run each command and tick when it passes.</p>
      <ul className="cl">
        {steps.map((s, i) => {
          const key = `out-${labId}-${i}`;
          const done = !!progress[key];
          return (
            <li key={i} className={done ? 'done' : ''} onClick={() => toggleCheck(key)}>
              <div className="cb">{done ? '✓' : ''}</div>
              <code style={{ fontFamily: 'var(--fm)', fontSize: 12 }}>{s}</code>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
