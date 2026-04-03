import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';

export default function FillInBlank({ labId, lines, prefix, maxScore = 20 }) {
  const { showToast, saveFillIn, progress, updateAutoScore } = useApp();

  const blanks = useMemo(() => lines.filter(ln => ln.b), [lines]);
  const totalBlanks = blanks.length;

  const [values, setValues] = useState(() => {
    const init = {};
    lines.forEach((ln, i) => {
      if (ln.b) {
        const key = `fi-${labId}-${prefix}-${i}`;
        init[i] = progress[key] || '';
      }
    });
    return init;
  });
  const [states, setStates] = useState(() => {
    // Check already saved correct answers
    const init = {};
    lines.forEach((ln, i) => {
      if (ln.b) {
        const key = `fi-${labId}-${prefix}-${i}`;
        if (progress[key] && progress[key] === ln.b) init[i] = 'ok';
      }
    });
    return init;
  });

  // Auto-score on state changes
  useEffect(() => {
    if (totalBlanks === 0) return;
    const correctCount = Object.values(states).filter(s => s === 'ok').length;
    const score = Math.round((correctCount / totalBlanks) * maxScore);
    updateAutoScore(labId, prefix === 'pre' ? 'pre' : 'post', score);
  }, [states, totalBlanks, labId, prefix, maxScore, updateAutoScore]);

  const check = (i, answer, key) => {
    const val = (values[i] || '').trim();
    if (!val) return;
    saveFillIn(key, val);
    if (val === answer) {
      setStates(s => ({ ...s, [i]: 'ok' }));
      showToast('+XP', 'Correct! ✓');
    } else {
      setStates(s => ({ ...s, [i]: 'no' }));
    }
  };

  const revealAll = () => {
    const nextVals = { ...values };
    const nextStates = { ...states };
    lines.forEach((ln, i) => {
      if (ln.b) {
        const key = `fi-${labId}-${prefix}-${i}`;
        nextVals[i] = ln.b;
        nextStates[i] = 'ok';
        saveFillIn(key, ln.b);
      }
    });
    setValues(nextVals);
    setStates(nextStates);
  };

  const correctCount = Object.values(states).filter(s => s === 'ok').length;

  return (
    <div>
      {/* Score bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
        padding: '8px 14px', background: 'var(--bg3)', borderRadius: 8,
        border: '1px solid var(--border)'
      }}>
        <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>Filled</span>
        <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${(correctCount / totalBlanks) * 100}%`, height: '100%',
            background: 'linear-gradient(90deg, var(--teal), var(--green))',
            borderRadius: 2, transition: 'width .4s ease'
          }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>{correctCount}/{totalBlanks}</span>
        <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>
          {Math.round((correctCount / totalBlanks) * maxScore)} XP
        </span>
      </div>

      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>
        Complete the blanks. Hover inputs for a hint.
      </p>
      <div className="fi-wrap">
        {lines.map((ln, i) => {
          if (!ln.b) {
            return <div key={i} className="fi-line">{ln.t}{ln.a}</div>;
          }
          const key = `fi-${labId}-${prefix}-${i}`;
          const blankCls = `blank${states[i] ? ` ${states[i]}` : ''}`;
          return (
            <div key={i} className="fi-line">
              {ln.t}
              <input
                className={blankCls}
                value={values[i] || ''}
                placeholder="___"
                title={`Hint: ${ln.h}`}
                onChange={e => setValues(v => ({ ...v, [i]: e.target.value }))}
                onBlur={() => check(i, ln.b, key)}
              />
              {ln.a}
            </div>
          );
        })}
      </div>
      <button className="btn btn-gh" onClick={revealAll}>Reveal Answers</button>
    </div>
  );
}
