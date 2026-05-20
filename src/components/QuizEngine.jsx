import React, { useState, useEffect, useCallback } from 'react';

// Shuffle array keeping track of original indices
function shuffleArray(arr) {
  const a = arr.map((v, i) => ({ v, i }));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizEngine({ subject, totalQ, isMixedExam, goHome, onComplete }) {
  const [currentQ, setCurrentQ]         = useState(0);
  const [selectedOpt, setSelectedOpt]   = useState(-1);   // index into shuffledOptions
  const [isLocked, setIsLocked]         = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const [userAnswers, setUserAnswers]   = useState([]);
  const [mistakes, setMistakes]         = useState([]);
  const [diagramModal, setDiagramModal] = useState(null);
  const [animKey, setAnimKey]           = useState(0);     // forces re-mount animation

  // Reinit on question change
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
  const pct     = ((currentQ) / totalQ) * 100;
  const letters = ['A', 'B', 'C', 'D'];
  const isLast  = currentQ === totalQ - 1;

  // ── Lock Answer ──────────────────────────────────
  const lockAnswer = () => {
    if (selectedOpt === -1 || isLocked) return;
    setIsLocked(true);

    const correctOrigIdx = q.ans;
    const userOrigIdx    = shuffledOptions[selectedOpt].i;
    const isCorrect      = userOrigIdx === correctOrigIdx;

    const newAnswer = { qIdx: currentQ, userAns: userOrigIdx, correct: isCorrect };
    const newUserAnswers = [...userAnswers, newAnswer];
    setUserAnswers(newUserAnswers);

    if (!isCorrect) {
      setMistakes(prev => [...prev, {
        q:          q.q,
        yourAns:    q.options[userOrigIdx],
        correctAns: q.options[correctOrigIdx],
        exp:        q.exp,
      }]);
    }
  };

  // ── Next / Finish ─────────────────────────────────
  const goNext = () => {
    if (!isLocked) return;
    if (!isLast) {
      setCurrentQ(c => c + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // use the local newUserAnswers computed in lockAnswer
      // since state updates are async we pass through a callback approach
      setUserAnswers(prev => {
        onComplete(prev, mistakes);
        return prev;
      });
    }
  };

  // Unified action button handler
  const handleAction = () => {
    if (!isLocked) lockAnswer();
    else           goNext();
  };

  // Build per-option class names (plain CSS classes, no dynamic Tailwind purge issues)
  const getOptClass = (o, i) => {
    const classes = ['option-btn'];
    if (isLocked) {
      classes.push('opt-locked');
      if (o.i === q.ans)                         classes.push('opt-correct');
      else if (i === selectedOpt)                classes.push('opt-wrong');
    } else {
      if (i === selectedOpt)                     classes.push('opt-selected');
    }
    return classes.join(' ');
  };

  const getLetterClass = (o, i) => {
    const base = 'opt-letter';
    if (!isLocked) return i === selectedOpt ? `${base} !bg-indigo-500 !text-white` : base;
    if (o.i === q.ans)      return `${base} !bg-emerald-500 !text-white`;
    if (i === selectedOpt)  return `${base} !bg-rose-500 !text-white`;
    return base;
  };

  return (
    <div id="quiz-view">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <button className="btn-back" onClick={goHome}>← Back</button>
        <span
          className="text-base font-bold text-gradient truncate max-w-[55%]"
          title={subject.name}
        >
          {isMixedExam ? '📝 Mixed Exam Mode' : subject.name}
        </span>
      </div>

      {/* ── Progress ── */}
      <div className="progress-track mb-2">
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="text-xs text-right mb-5" style={{ color: '#64748b' }}>
        Question {currentQ + 1} / {totalQ}
      </div>

      {/* ── Question Card ── */}
      <div key={animKey} className="glass-card p-6 md:p-8 mb-5 anim-fade-up">
        {/* Q Number + subject tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[0.68rem] uppercase tracking-[0.14em] font-semibold" style={{ color: '#8b5cf6' }}>
            Question {currentQ + 1}
          </span>
          {isMixedExam && q._subjectTag && (
            <span
              className="text-[0.6rem] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider"
              style={{ background: `${q._subjectColor}20`, color: q._subjectColor }}
            >
              {q._subjectTag}
            </span>
          )}
        </div>

        {/* Question text — supports HTML (for <br> tags in original data) */}
        <div
          className="text-base md:text-lg font-medium leading-[1.75] mb-5"
          style={{ color: '#f1f5f9' }}
          dangerouslySetInnerHTML={{ __html: q.q }}
        />

        {/* Diagram */}
        {q.img && (
          <div className="mb-5">
            <img
              src={q.img}
              alt="Question diagram"
              onClick={() => setDiagramModal(q.img)}
              className="max-w-full h-auto rounded-xl cursor-zoom-in block"
              style={{
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.boxShadow = '0 12px 40px rgba(99,102,241,0.25)';
              }}
              onMouseLeave={e => {
                e.target.style.transform = '';
                e.target.style.boxShadow = '0 8px 32px rgba(0,0,0,0.35)';
              }}
            />
            <p className="text-center text-xs mt-2 italic" style={{ color: '#64748b' }}>
              📎 Reference diagram — click to enlarge
            </p>
          </div>
        )}

        {/* Options */}
        <div className="flex flex-col gap-2.5">
          {shuffledOptions.map((o, i) => (
            <button
              key={i}
              className={getOptClass(o, i)}
              onClick={() => { if (!isLocked) setSelectedOpt(i); }}
            >
              <span className={getLetterClass(o, i)}>{letters[i]}</span>
              <span
                className="pt-0.5 leading-relaxed text-left flex-1"
                dangerouslySetInnerHTML={{ __html: o.v }}
              />
            </button>
          ))}
        </div>
      </div>

      {/* ── Explanation ── */}
      {isLocked && (
        <div className="explanation-box anim-fade-up mb-4">
          <span style={{ color: '#6366f1', fontWeight: 700 }}>Explanation: </span>
          <span dangerouslySetInnerHTML={{ __html: q.exp }} />
        </div>
      )}

      {/* ── Action Button ── */}
      {!isLocked ? (
        <button
          className="btn-primary"
          disabled={selectedOpt === -1}
          onClick={handleAction}
        >
          🔒 Lock Answer
        </button>
      ) : (
        <button className="btn-success" onClick={handleAction}>
          {isLast ? '🏆 View Results' : 'Next Question →'}
        </button>
      )}

      {/* ── Diagram Modal ── */}
      {diagramModal && (
        <div
          className="anim-fade-in"
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out',
            padding: '20px',
          }}
          onClick={() => setDiagramModal(null)}
        >
          <img
            src={diagramModal}
            alt="Enlarged diagram"
            style={{ maxWidth: '95vw', maxHeight: '95vh', borderRadius: '14px', boxShadow: '0 0 80px rgba(99,102,241,0.35)' }}
          />
        </div>
      )}
    </div>
  );
}
