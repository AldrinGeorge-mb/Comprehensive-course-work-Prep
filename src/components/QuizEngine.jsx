import React, { useState, useEffect } from 'react';

function shuffleArray(arr) {
  const a = arr.map((v, i) => ({ v, i }));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizEngine({ subject, totalQ, isMixedExam, goHome, onComplete }) {
  const [currentQ, setCurrentQ]               = useState(0);
  const [selectedOpt, setSelectedOpt]         = useState(-1);
  const [isLocked, setIsLocked]               = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [userAnswers, setUserAnswers]         = useState([]);
  const [mistakes, setMistakes]               = useState([]);
  const [diagramModal, setDiagramModal]       = useState(null);
  const [animKey, setAnimKey]                 = useState(0);

  useEffect(() => {
    if (subject?.questions?.[currentQ]) {
      setShuffledOptions(shuffleArray(subject.questions[currentQ].options));
      setSelectedOpt(-1);
      setIsLocked(false);
      setAnimKey(k => k + 1);
    }
  }, [currentQ, subject]);

  if (!subject?.questions?.[currentQ]) return null;

  const q       = subject.questions[currentQ];
  const pct     = (currentQ / totalQ) * 100;
  const letters = ['A', 'B', 'C', 'D'];
  const isLast  = currentQ === totalQ - 1;

  /* ── Lock Answer ── */
  const lockAnswer = () => {
    if (selectedOpt === -1 || isLocked) return;
    setIsLocked(true);
    const correctIdx = q.ans;
    const userIdx    = shuffledOptions[selectedOpt].i;
    const correct    = userIdx === correctIdx;

    const newAnswers = [...userAnswers, { qIdx: currentQ, userAns: userIdx, correct }];
    setUserAnswers(newAnswers);

    if (!correct) {
      setMistakes(prev => [...prev, {
        q:          q.q,
        yourAns:    q.options[userIdx],
        correctAns: q.options[correctIdx],
        exp:        q.exp,
      }]);
    }
  };

  /* ── Next / Finish ── */
  const goNext = () => {
    if (!isLocked) return;
    if (!isLast) {
      setCurrentQ(c => c + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setUserAnswers(prev => { onComplete(prev, mistakes); return prev; });
    }
  };

  const handleAction = () => !isLocked ? lockAnswer() : goNext();

  /* ── Option classes ── */
  const optClass = (o, i) => {
    const c = ['opt-btn'];
    if (isLocked) {
      c.push('opt-locked');
      if (o.i === q.ans)       c.push('opt-correct');
      else if (i === selectedOpt) c.push('opt-wrong');
    } else {
      if (i === selectedOpt)   c.push('opt-selected');
    }
    return c.join(' ');
  };

  const letterClass = (o, i) => {
    if (!isLocked) return i === selectedOpt ? 'opt-letter' : 'opt-letter';
    if (o.i === q.ans)      return 'opt-letter';
    if (i === selectedOpt)  return 'opt-letter';
    return 'opt-letter';
  };

  // Subject accent color
  const accentColor = isMixedExam && q._subjectColor ? q._subjectColor : (subject.color || '#6366f1');
  const correctCount = userAnswers.filter(a => a.correct).length;

  return (
    <div style={{ paddingTop: 32, paddingBottom: 20 }}>

      {/* ── Top bar ── */}
      <div className="anim-in" style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28, gap:12, flexWrap:'wrap' }}>
        <button className="btn btn-ghost" onClick={goHome}>← Back</button>

        {/* Live score pill */}
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {currentQ > 0 && (
            <span style={{
              padding:'5px 14px', borderRadius:999,
              background:'rgba(16,185,129,0.10)', border:'1px solid rgba(16,185,129,0.22)',
              color:'#6ee7b7', fontSize:'0.73rem', fontWeight:700,
            }}>
              ✓ {correctCount} / {currentQ}
            </span>
          )}
          <span style={{
            fontWeight:800, fontSize:'0.9rem',
            background:`linear-gradient(135deg, ${accentColor}, #8b5cf6)`,
            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            maxWidth:200, overflow:'hidden', whiteSpace:'nowrap', textOverflow:'ellipsis',
          }}>
            {isMixedExam ? '📝 Mixed Exam' : subject.name}
          </span>
        </div>
      </div>

      {/* ── Progress ── */}
      <div className="anim-in" style={{ marginBottom:28 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
          <span className="t-label">Progress</span>
          <span className="t-mono" style={{ fontSize:'0.78rem', color:'#64748b' }}>
            {currentQ + 1} <span style={{ color:'#2d3748' }}>/ {totalQ}</span>
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width:`${pct}%` }}/>
        </div>
      </div>

      {/* ── Question Card ── */}
      <div key={animKey} className="card-flat anim-up" style={{ padding:'28px 26px', marginBottom:16, border:'1px solid rgba(255,255,255,0.06)' }}>

        {/* Question meta row */}
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
          {/* Large question number */}
          <span className="t-mono" style={{
            fontSize:'0.7rem', fontWeight:700, color:'rgba(255,255,255,0.12)',
            padding:'4px 10px', borderRadius:8, background:'rgba(255,255,255,0.03)',
            border:'1px solid rgba(255,255,255,0.06)',
          }}>
            Q{String(currentQ + 1).padStart(2,'0')}
          </span>

          {isMixedExam && q._subjectTag && (
            <span style={{
              fontSize:'0.6rem', padding:'3px 9px', borderRadius:7,
              background:`${q._subjectColor}18`, color:q._subjectColor,
              fontWeight:800, textTransform:'uppercase', letterSpacing:'0.1em',
              border:`1px solid ${q._subjectColor}28`,
            }}>
              {q._subjectTag}
            </span>
          )}
        </div>

        {/* Question text */}
        <div
          style={{ fontSize:'1.05rem', fontWeight:500, lineHeight:1.8, color:'#eef2ff', marginBottom:22 }}
          dangerouslySetInnerHTML={{ __html: q.q }}
        />

        {/* Diagram */}
        {q.img && (
          <div style={{ marginBottom:22 }}>
            <img
              src={q.img}
              alt="Question diagram"
              onClick={() => setDiagramModal(q.img)}
              style={{
                maxWidth:'100%', height:'auto', borderRadius:12, display:'block',
                border:'1px solid rgba(255,255,255,0.08)',
                boxShadow:'0 8px 40px rgba(0,0,0,0.4)',
                cursor:'zoom-in',
                transition:'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => { e.target.style.transform='scale(1.015)'; e.target.style.boxShadow='0 12px 50px rgba(99,102,241,0.25)'; }}
              onMouseLeave={e => { e.target.style.transform=''; e.target.style.boxShadow='0 8px 40px rgba(0,0,0,0.4)'; }}
            />
            <p style={{ color:'#2d3748', fontSize:'0.7rem', marginTop:8, textAlign:'center', fontStyle:'italic' }}>
              📎 Click diagram to enlarge
            </p>
          </div>
        )}

        {/* ── Options ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {shuffledOptions.map((o, i) => (
            <button
              key={i}
              className={optClass(o, i)}
              onClick={() => { if (!isLocked) setSelectedOpt(i); }}
            >
              <span className="opt-letter">{letters[i]}</span>
              <span
                style={{ paddingTop:2, lineHeight:1.6, textAlign:'left', flex:1 }}
                dangerouslySetInnerHTML={{ __html: o.v }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Explanation ── */}
      {isLocked && (
        <div className="exp-box anim-up" style={{ marginBottom:16 }}>
          <span style={{ color:'#818cf8', fontWeight:800, marginRight:6 }}>Explanation:</span>
          <span dangerouslySetInnerHTML={{ __html: q.exp }}/>
        </div>
      )}

      {/* ── Action Button ── */}
      <div className="anim-in">
        {!isLocked ? (
          <button className="btn btn-lock" disabled={selectedOpt === -1} onClick={handleAction}>
            🔒  Lock Answer
          </button>
        ) : (
          <button className="btn btn-next" onClick={handleAction}>
            {isLast ? '🏆  View Results' : 'Next Question  →'}
          </button>
        )}
      </div>

      {/* ── Diagram Modal ── */}
      {diagramModal && (
        <div
          className="anim-in"
          style={{
            position:'fixed', inset:0, background:'rgba(0,0,0,0.94)',
            zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center',
            cursor:'zoom-out', padding:20,
          }}
          onClick={() => setDiagramModal(null)}
        >
          <img
            src={diagramModal} alt="Enlarged diagram"
            style={{ maxWidth:'95vw', maxHeight:'95vh', borderRadius:16, boxShadow:'0 0 100px rgba(99,102,241,0.4)' }}
          />
        </div>
      )}
    </div>
  );
}
