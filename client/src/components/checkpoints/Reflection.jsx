import { useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext.jsx';

export default function Reflection({ labId, qs, prefix, maxScore = 20 }) {
  const { saveReflection, progress, updateAutoScore, showToast } = useApp();
  const MIN_CHARS = 15;
  const scored = useRef(false);

  // Auto-score: each answered question (>= MIN_CHARS) earns proportional XP
  useEffect(() => {
    const answeredCount = qs.filter((_, i) => {
      const key = `ref-${labId}-${prefix}-${i}`;
      return (progress[key] || '').trim().length >= MIN_CHARS;
    }).length;
    const score = Math.round((answeredCount / qs.length) * maxScore);
    updateAutoScore(labId, prefix === 'pre' ? 'pre' : 'post', score);

    if (answeredCount === qs.length && !scored.current) {
      scored.current = true;
    }
  }, [progress, qs, labId, prefix, maxScore, updateAutoScore]);

  const answeredCount = qs.filter((_, i) => {
    const key = `ref-${labId}-${prefix}-${i}`;
    return (progress[key] || '').trim().length >= MIN_CHARS;
  }).length;

  return (
    <div>
      {/* Score bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
        padding: '8px 14px', background: 'var(--bg3)', borderRadius: 8,
        border: '1px solid var(--border)'
      }}>
        <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Answered</span>
        <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${(answeredCount / qs.length) * 100}%`, height: '100%',
            background: 'linear-gradient(90deg, var(--teal), var(--green))',
            borderRadius: 2, transition: 'width .4s ease'
          }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>{answeredCount}/{qs.length}</span>
        <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>
          {Math.round((answeredCount / qs.length) * maxScore)} XP
        </span>
      </div>

      {qs.map((q, i) => {
        const key = `ref-${labId}-${prefix}-${i}`;
        const val = progress[key] || '';
        const isValid = val.trim().length >= MIN_CHARS;
        return (
          <div key={i}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div className="rl">Question {i + 1}</div>
              {isValid && <span style={{ fontSize: 10, color: 'var(--green)', fontWeight: 700 }}>✓ Scored</span>}
            </div>
            <div className="rq">{q}</div>
            <textarea
              className="ra"
              placeholder={`Your honest reflection... (min ${MIN_CHARS} characters to earn XP)`}
              defaultValue={val}
              onChange={e => saveReflection(key, e.target.value)}
              style={isValid ? { borderColor: 'var(--green)' } : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
