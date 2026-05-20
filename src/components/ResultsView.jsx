import React, { useEffect, useState, useRef } from 'react';

const GRADES = [
  { min:90, emoji:'🏆', label:'Outstanding',    color:'#fcd34d' },
  { min:70, emoji:'🎯', label:'Excellent',       color:'#10b981' },
  { min:50, emoji:'📈', label:'Good Progress',   color:'#06b6d4' },
  { min:30, emoji:'💪', label:'Keep Practising', color:'#f59e0b' },
  { min:0,  emoji:'🔁', label:'Need More Work',  color:'#f43f5e' },
];

export default function ResultsView({ subject, totalQ, userAnswers, mistakes, goHome }) {
  const score = userAnswers.filter(a => a.correct).length;
  const wrong = totalQ - score;
  const pct   = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;

  const grade = GRADES.find(g => pct >= g.min);
  const ringColor = grade.color;

  const [displayScore, setDisplayScore] = useState(0);
  const [ringDeg, setRingDeg]           = useState(0);
  const tmr = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setRingDeg((pct / 100) * 360), 150);
    if (score === 0) return;
    let c = 0;
    const step = Math.max(15, Math.floor(600 / score));
    tmr.current = setInterval(() => {
      c++;
      setDisplayScore(c);
      if (c >= score) clearInterval(tmr.current);
    }, step);
    return () => clearInterval(tmr.current);
  }, [score, pct]);

  return (
    <div style={{ paddingTop: 48, paddingBottom: 20 }}>

      {/* ── Subject name ── */}
      <div className="anim-up" style={{ textAlign:'center', marginBottom:4 }}>
        <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#4a5568', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10 }}>
          Quiz Complete
        </p>
        <h1 style={{
          fontSize:'clamp(1.3rem,3.5vw,2rem)', fontWeight:900, letterSpacing:'-0.02em',
          background:'linear-gradient(135deg, #e0e7ff, #c4b5fd)',
          WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
        }}>
          {subject?.name}
        </h1>
      </div>

      {/* ── Score Ring ── */}
      <div
        className="score-ring anim-scale"
        style={{ '--ring-color': ringColor, '--ring-deg': `${ringDeg}deg` }}
      >
        {/* Inner glow */}
        <div style={{
          position:'absolute', inset:8, borderRadius:'50%',
          background:`radial-gradient(circle, ${ringColor}12 0%, transparent 70%)`,
        }}/>
        <div style={{ position:'relative', textAlign:'center' }}>
          <div className="t-mono" style={{ fontSize:'3.5rem', fontWeight:900, lineHeight:1, color: ringColor }}>
            {displayScore}
          </div>
          <div style={{ fontSize:'0.78rem', color:'#4a5568', marginTop:4, fontWeight:600 }}>
            out of {totalQ}
          </div>
        </div>
      </div>

      {/* ── Grade banner ── */}
      <div className="anim-up delay-1" style={{ textAlign:'center', marginBottom:28 }}>
        <div style={{ fontSize:'1.8rem', marginBottom:6 }}>{grade.emoji}</div>
        <div style={{ fontWeight:800, fontSize:'1.1rem', color: grade.color }}>{grade.label}</div>
        <div style={{ color:'#4a5568', fontSize:'0.82rem', marginTop:3 }}>{pct}% score</div>
      </div>

      {/* ── Stats row ── */}
      <div className="anim-up delay-2" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', marginBottom:32 }}>
        <div style={{
          padding:'14px 24px', borderRadius:14, textAlign:'center',
          background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)',
        }}>
          <div className="t-mono" style={{ fontSize:'1.8rem', fontWeight:900, color:'#10b981', lineHeight:1 }}>{score}</div>
          <div style={{ fontSize:'0.67rem', fontWeight:700, color:'#4a5568', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:5 }}>Correct</div>
        </div>
        <div style={{
          padding:'14px 24px', borderRadius:14, textAlign:'center',
          background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.2)',
        }}>
          <div className="t-mono" style={{ fontSize:'1.8rem', fontWeight:900, color:'#f43f5e', lineHeight:1 }}>{wrong}</div>
          <div style={{ fontSize:'0.67rem', fontWeight:700, color:'#4a5568', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:5 }}>Wrong</div>
        </div>
        <div style={{
          padding:'14px 24px', borderRadius:14, textAlign:'center',
          background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)',
        }}>
          <div className="t-mono" style={{ fontSize:'1.8rem', fontWeight:900, color:'#f59e0b', lineHeight:1 }}>{pct}%</div>
          <div style={{ fontSize:'0.67rem', fontWeight:700, color:'#4a5568', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:5 }}>Accuracy</div>
        </div>
      </div>

      {/* ── Mistakes review ── */}
      {mistakes.length > 0 ? (
        <div className="card-flat anim-up delay-3" style={{ padding:'26px 28px', marginBottom:24 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:22 }}>
            <span style={{ fontSize:'1.1rem' }}>📋</span>
            <span style={{ fontWeight:800, fontSize:'1rem', color:'#e0e7ff' }}>Mistakes Review</span>
            <span style={{
              marginLeft:'auto', padding:'3px 10px', borderRadius:8,
              background:'rgba(244,63,94,0.12)', color:'#fda4af',
              fontSize:'0.68rem', fontWeight:800, border:'1px solid rgba(244,63,94,0.22)',
            }}>
              {mistakes.length} wrong
            </span>
          </div>

          <div>
            {mistakes.map((m, i) => (
              <div
                key={i}
                style={{
                  padding:'18px 0',
                  borderBottom: i !== mistakes.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                }}
              >
                {/* Question */}
                <div
                  style={{ fontSize:'0.875rem', fontWeight:600, color:'#e0e7ff', lineHeight:1.6, marginBottom:12 }}
                  dangerouslySetInnerHTML={{ __html: `${i+1}. ${m.q}` }}
                />
                {/* Answer comparison */}
                <div style={{
                  display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10,
                }}>
                  <div style={{
                    padding:'10px 14px', borderRadius:11,
                    background:'rgba(244,63,94,0.08)', border:'1px solid rgba(244,63,94,0.2)',
                  }}>
                    <div style={{ fontSize:'0.6rem', fontWeight:700, color:'#f43f5e', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Your Answer</div>
                    <div style={{ fontSize:'0.82rem', color:'#fca5a5' }}>{m.yourAns}</div>
                  </div>
                  <div style={{
                    padding:'10px 14px', borderRadius:11,
                    background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.2)',
                  }}>
                    <div style={{ fontSize:'0.6rem', fontWeight:700, color:'#10b981', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:4 }}>Correct Answer</div>
                    <div style={{ fontSize:'0.82rem', color:'#6ee7b7' }}>{m.correctAns}</div>
                  </div>
                </div>
                {/* Explanation */}
                <div style={{
                  padding:'10px 14px', borderRadius:10,
                  background:'rgba(99,102,241,0.06)', border:'1px solid rgba(99,102,241,0.12)',
                  fontSize:'0.78rem', color:'#a5b4fc', lineHeight:1.6,
                }}>
                  💡 {m.exp}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="anim-scale delay-3" style={{ textAlign:'center', padding:'32px', marginBottom:24 }}>
          <div style={{ fontSize:'3rem', marginBottom:10 }}>🎯</div>
          <div style={{ fontWeight:800, fontSize:'1.1rem', color:'#10b981' }}>Perfect Score!</div>
          <div style={{ color:'#4a5568', fontSize:'0.85rem', marginTop:4 }}>You got every single question right.</div>
        </div>
      )}

      <button className="btn btn-home anim-up delay-4" onClick={goHome}>
        ← Return to Dashboard
      </button>
    </div>
  );
}
