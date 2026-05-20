import React, { useEffect, useState, useRef } from 'react';

export default function ResultsView({ subject, totalQ, userAnswers, mistakes, goHome }) {
  const score  = userAnswers.filter(a => a.correct).length;
  const wrong  = totalQ - score;
  const pct    = totalQ > 0 ? (score / totalQ) * 100 : 0;
  const color  = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#f43f5e';

  const [displayScore, setDisplayScore] = useState(0);
  const [ringDeg, setRingDeg]           = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Animate ring
    const targetDeg = (pct / 100) * 360;
    setTimeout(() => setRingDeg(targetDeg), 120);

    // Animate counter
    if (score === 0) return;
    let count = 0;
    intervalRef.current = setInterval(() => {
      count++;
      setDisplayScore(count);
      if (count >= score) clearInterval(intervalRef.current);
    }, Math.max(20, 600 / score));

    return () => clearInterval(intervalRef.current);
  }, [score, pct]);

  const emoji = pct >= 70 ? '🎉' : pct >= 40 ? '📈' : '💪';
  const label = pct >= 70 ? 'Great work!' : pct >= 40 ? 'Keep going!' : 'Keep practicing!';

  return (
    <div className="anim-fade-up">

      {/* Header */}
      <div style={{ textAlign: 'center', padding: '36px 0 10px' }}>
        <h1 className="text-gradient font-black" style={{ fontSize: 'clamp(1.4rem,3.5vw,2.2rem)', marginBottom: 6 }}>
          {subject?.name}
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Quiz Complete</p>
      </div>

      {/* Score Ring */}
      <div
        className="score-ring"
        style={{
          '--ring-color': color,
          '--ring-deg': `${ringDeg}deg`,
        }}
      >
        <div style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1, color }}>{displayScore}</div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>out of {totalQ}</div>
      </div>

      {/* Grade label */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <span style={{ fontSize: '1.1rem' }}>{emoji}</span>
        <span style={{ fontSize: '0.9rem', color: '#94a3b8', marginLeft: 8 }}>{label}</span>
      </div>

      {/* Stats chips */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
        <span style={{
          padding: '8px 18px', borderRadius: 11, fontSize: '0.78rem', fontWeight: 700,
          background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.22)', color: '#10b981',
        }}>
          ✓ {score} Correct
        </span>
        <span style={{
          padding: '8px 18px', borderRadius: 11, fontSize: '0.78rem', fontWeight: 700,
          background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.22)', color: '#f43f5e',
        }}>
          ✗ {wrong} Wrong
        </span>
        <span style={{
          padding: '8px 18px', borderRadius: 11, fontSize: '0.78rem', fontWeight: 700,
          background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.22)', color: '#f59e0b',
        }}>
          📊 {Math.round(pct)}%
        </span>
      </div>

      {/* Mistakes card */}
      {mistakes.length > 0 && (
        <div
          className="glass-card"
          style={{ padding: '26px 28px', marginBottom: 20 }}
        >
          <div style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
            📋 <span>Mistakes Review</span>
            <span style={{ fontSize: '0.72rem', padding: '2px 10px', borderRadius: 8, background: 'rgba(244,63,94,0.12)', color: '#f43f5e', fontWeight: 600, marginLeft: 4 }}>
              {mistakes.length} wrong
            </span>
          </div>
          <div>
            {mistakes.map((m, i) => (
              <div
                key={i}
                style={{
                  padding: '16px 0',
                  borderBottom: i !== mistakes.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                }}
              >
                <div
                  style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: 10, color: '#f1f5f9', lineHeight: 1.55 }}
                  dangerouslySetInnerHTML={{ __html: `${i + 1}. ${m.q}` }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: '0.78rem', color: '#f43f5e' }}>✗ Your answer: {m.yourAns}</span>
                  <span style={{ fontSize: '0.78rem', color: '#10b981' }}>✓ Correct: {m.correctAns}</span>
                  <span style={{ fontSize: '0.76rem', color: '#64748b', fontStyle: 'italic', marginTop: 4 }}>{m.exp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {mistakes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '20px', marginBottom: 20 }}>
          <div style={{ fontSize: '2.5rem' }}>🎯</div>
          <div style={{ color: '#10b981', fontWeight: 700, marginTop: 8 }}>Perfect Score! No mistakes.</div>
        </div>
      )}

      <button className="btn-home" onClick={goHome}>← Return to Dashboard</button>
    </div>
  );
}
