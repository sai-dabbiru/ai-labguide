import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';

export default function BugHunt({ labId, lines, bugs, explains, prefix, maxScore = 20 }) {
  const { showToast, updateAutoScore } = useApp();
  const [selected, setSelected] = useState(new Set());
  const [revealed, setRevealed] = useState(false);
  const [score, setScore] = useState(0);

  const toggle = (i) => {
    if (revealed) return;
    const next = new Set(selected);
    if (next.has(i)) next.delete(i); else next.add(i);
    setSelected(next);
  };

  const reveal = () => {
    // Calculate score BEFORE reveal: how many bugs the user correctly identified
    const correctlyFound = [...selected].filter(i => bugs.includes(i)).length;
    const falsePositives = [...selected].filter(i => !bugs.includes(i)).length;
    // Deduct for false positives, minimum 0
    const rawScore = Math.max(0, correctlyFound - (falsePositives * 0.5));
    const earned = Math.round((rawScore / bugs.length) * maxScore);
    setScore(earned);
    updateAutoScore(labId, prefix === 'pre' ? 'pre' : 'post', earned);

    if (correctlyFound === bugs.length && falsePositives === 0) {
      showToast(`+${earned} XP`, `Perfect! Found all ${bugs.length} bugs!`);
    } else if (correctlyFound > 0) {
      showToast(`+${earned} XP`, `Found ${correctlyFound}/${bugs.length} bugs`);
    } else {
      showToast('', 'No bugs found — review the explanations below');
    }

    setRevealed(true);
  };

  const lineClass = (i) => {
    let cls = 'bl';
    if (revealed) {
      if (bugs.includes(i)) {
        const found = selected.has(i);
        return cls + ' is-bug' + (found ? '' : '');
      }
      return cls;
    }
    if (selected.has(i)) return cls + ' sel';
    return cls;
  };

  const correctlyFound = [...selected].filter(i => bugs.includes(i)).length;

  return (
    <div>
      {/* Score bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12,
        padding: '8px 14px', background: 'var(--bg3)', borderRadius: 8,
        border: '1px solid var(--border)'
      }}>
        <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
          {revealed ? 'Score' : 'Selected'}
        </span>
        {revealed ? (
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gold)' }}>
            Found {correctlyFound}/{bugs.length} bugs → {score} XP earned
          </span>
        ) : (
          <span style={{ fontSize: 12, color: 'var(--text2)' }}>
            {selected.size} line{selected.size !== 1 ? 's' : ''} selected — find {bugs.length} bugs
          </span>
        )}
      </div>

      <p style={{ fontSize: 13, color: 'var(--text2)', marginBottom: 10 }}>
        Click lines you think contain bugs. There are{' '}
        <strong style={{ color: 'var(--red)' }}>{bugs.length} bugs</strong> to find.
        {!revealed && <span style={{ color: 'var(--text3)', fontSize: 11 }}> (False positives reduce your score)</span>}
      </p>
      <div className="code-wrap">
        {lines.map((line, i) => (
          <div key={i} className={lineClass(i)} onClick={() => toggle(i)}>
            <span className="bl-num">{i + 1}</span>
            <span>{line || ' '}</span>
            {revealed && bugs.includes(i) && (
              <span style={{ marginLeft: 'auto', fontSize: 10, color: selected.has(i) ? 'var(--green)' : 'var(--red)' }}>
                {selected.has(i) ? '✓ Found' : '✗ Missed'}
              </span>
            )}
          </div>
        ))}
      </div>
      <button className="btn btn-red" onClick={reveal} disabled={revealed}>
        {revealed ? `Scored: ${score}/${maxScore} XP` : 'Submit & Score'}
      </button>
      {revealed && (
        <div className="bug-explain" style={{ marginTop: 12 }}>
          {explains.map((e, i) => (
            <div key={i} className="be">
              <strong>Bug {i + 1}</strong><br />{e}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
