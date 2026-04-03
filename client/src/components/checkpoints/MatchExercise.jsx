import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';

export default function MatchExercise({ labId, pairs, prefix = 'pre', maxScore = 20 }) {
  const { showToast, updateAutoScore } = useApp();
  const shuffledRight = useMemo(() => [...pairs].sort(() => Math.random() - 0.5), []);
  const [sel, setSel] = useState(null);
  const [matched, setMatched] = useState(new Set());
  const [feedback, setFeedback] = useState('');
  const [errKeys, setErrKeys] = useState(new Set());

  // Auto-score on match changes
  useEffect(() => {
    const score = Math.round((matched.size / pairs.length) * maxScore);
    updateAutoScore(labId, prefix === 'pre' ? 'pre' : 'post', score);
  }, [matched, pairs.length, labId, prefix, maxScore, updateAutoScore]);

  const handleClick = (side, key) => {
    if (matched.has(key)) return;
    if (!sel) { setSel({ side, key }); return; }
    if (sel.side === side) { setSel({ side, key }); return; }

    if (sel.key === key) {
      const next = new Set(matched);
      next.add(key);
      setMatched(next);
      setSel(null);
      showToast('+XP', 'Matched! ✓');
      if (next.size === pairs.length) setFeedback(`All ${pairs.length} pairs matched! 🎉`);
    } else {
      const errSet = new Set([sel.key, key]);
      setErrKeys(errSet);
      setTimeout(() => setErrKeys(new Set()), 500);
      setSel(null);
    }
  };

  const itemClass = (side, key) => {
    let cls = 'mi';
    if (matched.has(key)) return cls + ' matched';
    if (errKeys.has(key)) return cls + ' err';
    if (sel && sel.key === key && sel.side === side) return cls + ' sel';
    return cls;
  };

  return (
    <div>
      {/* Score bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
        padding: '8px 14px', background: 'var(--bg3)', borderRadius: 8,
        border: '1px solid var(--border)'
      }}>
        <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Matched</span>
        <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${(matched.size / pairs.length) * 100}%`, height: '100%',
            background: 'linear-gradient(90deg, var(--teal), var(--green))',
            borderRadius: 2, transition: 'width .4s ease'
          }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>{matched.size}/{pairs.length}</span>
        <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>
          {Math.round((matched.size / pairs.length) * maxScore)} XP
        </span>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 12 }}>
        Click a left item, then its matching right item.
      </p>
      <div className="match-wrap">
        <div className="match-col">
          {pairs.map((p, i) => (
            <div key={i} className={itemClass('L', p[0])} onClick={() => handleClick('L', p[0])}>{p[0]}</div>
          ))}
        </div>
        <div className="match-col">
          {shuffledRight.map((p, i) => (
            <div key={i} className={itemClass('R', p[0])} onClick={() => handleClick('R', p[0])}>{p[1]}</div>
          ))}
        </div>
      </div>
      {feedback && <div style={{ marginTop: 10, fontSize: 13, color: 'var(--teal)' }}>{feedback}</div>}
    </div>
  );
}
