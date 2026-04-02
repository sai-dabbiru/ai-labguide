import { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';

export default function MCQ({ labId, qs, prefix, maxScore = 20 }) {
  const { showToast, updateAutoScore } = useApp();
  const [answers, setAnswers] = useState({});

  // Calculate and report score whenever answers change
  useEffect(() => {
    const correctCount = Object.entries(answers).filter(
      ([qi, selected]) => qs[parseInt(qi)] && selected === qs[parseInt(qi)].a
    ).length;
    const score = Math.round((correctCount / qs.length) * maxScore);
    updateAutoScore(labId, prefix === 'pre' ? 'pre' : 'post', score);
  }, [answers, qs, labId, prefix, maxScore, updateAutoScore]);

  const handleAnswer = (qi, selected, correct) => {
    if (answers[qi] !== undefined) return;
    setAnswers(prev => ({ ...prev, [qi]: selected }));
    if (selected === correct) showToast('+XP', 'Correct! ✓');
    else showToast('', 'Not quite — correct answer highlighted');
  };

  const revealAll = () => {
    const all = {};
    qs.forEach((q, i) => { all[i] = q.a; });
    setAnswers(all);
  };

  const answeredCount = Object.keys(answers).length;
  const correctCount = Object.entries(answers).filter(
    ([qi, sel]) => qs[parseInt(qi)] && sel === qs[parseInt(qi)].a
  ).length;

  return (
    <div>
      {/* Score bar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16,
        padding: '8px 14px', background: 'var(--bg3)', borderRadius: 8,
        border: '1px solid var(--border)'
      }}>
        <span style={{ fontSize: 11, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
          Progress
        </span>
        <div style={{ flex: 1, height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            width: `${(answeredCount / qs.length) * 100}%`,
            height: '100%',
            background: `linear-gradient(90deg, var(--teal), var(--green))`,
            borderRadius: 2, transition: 'width .4s ease'
          }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)' }}>
          {correctCount}/{qs.length} correct
        </span>
        <span style={{ fontSize: 11, color: 'var(--gold)', fontWeight: 700 }}>
          {Math.round((correctCount / qs.length) * maxScore)} XP
        </span>
      </div>

      {qs.map((q, qi) => (
        <div key={qi}>
          <div className="q-txt">{qi + 1}. {q.q}</div>
          {q.opts.map((opt, oi) => {
            const answered = answers[qi] !== undefined;
            const isSelected = answers[qi] === oi;
            const isCorrect = q.a === oi;
            let cls = 'mcq-opt';
            if (answered) {
              if (isSelected && isCorrect) cls += ' correct';
              else if (isSelected && !isCorrect) cls += ' wrong';
              else if (isCorrect) cls += ' reveal';
            }
            return (
              <div key={oi} className={cls} onClick={() => !answered && handleAnswer(qi, oi, q.a)}>
                <span className="mcq-key">{['A', 'B', 'C', 'D'][oi]}</span>
                {opt}
              </div>
            );
          })}
        </div>
      ))}
      <button className="btn btn-gh" style={{ marginTop: 10 }} onClick={revealAll}>
        Reveal All Answers
      </button>
    </div>
  );
}
