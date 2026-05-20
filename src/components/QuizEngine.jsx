import React, { useState, useEffect } from 'react';

// Helper to shuffle array and keep track of original indices
function shuffleArray(arr) {
  const a = arr.map((v, i) => ({ v, i }));
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function QuizEngine({ subject, totalQ, isMixedExam, goHome, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState(-1);
  const [isLocked, setIsLocked] = useState(false);
  
  // State for the current question's shuffled options
  const [shuffledOptions, setShuffledOptions] = useState([]);
  
  // Accumulated data
  const [userAnswers, setUserAnswers] = useState([]);
  const [mistakes, setMistakes] = useState([]);
  const [diagramModal, setDiagramModal] = useState(null);

  // Initialize options when question changes
  useEffect(() => {
    if (subject && subject.questions[currentQ]) {
      setShuffledOptions(shuffleArray(subject.questions[currentQ].options));
      setSelectedOpt(-1);
      setIsLocked(false);
    }
  }, [currentQ, subject]);

  if (!subject || !subject.questions[currentQ]) return null;

  const q = subject.questions[currentQ];
  const pct = (currentQ / totalQ) * 100;
  const letters = ['A', 'B', 'C', 'D'];

  const handleAction = () => {
    if (!isLocked) {
      // Lock answer
      setIsLocked(true);
      const correctOrigIdx = q.ans;
      const userOrigIdx = shuffledOptions[selectedOpt].i;
      const isCorrect = userOrigIdx === correctOrigIdx;

      const newUserAnswers = [...userAnswers, { qIdx: currentQ, userAns: userOrigIdx, correct: isCorrect }];
      setUserAnswers(newUserAnswers);

      if (!isCorrect) {
        setMistakes([...mistakes, {
          q: q.q,
          yourAns: q.options[userOrigIdx],
          correctAns: q.options[correctOrigIdx],
          exp: q.exp
        }]);
      }
    } else {
      // Next question or results
      if (currentQ < totalQ - 1) {
        setCurrentQ(currentQ + 1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onComplete(userAnswers, mistakes);
      }
    }
  };

  return (
    <div id="quiz-view" className="animate-[fadeSlideIn_0.4s_ease]">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <button className="bg-white/5 border border-border-card text-text-secondary px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:bg-white/10 hover:text-white flex items-center gap-1.5" onClick={goHome}>
          ← Back
        </button>
        <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-purple-500">
          {subject.name}
        </span>
      </div>

      <div className="w-full bg-white/5 rounded-full h-1.5 mb-2 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-in-out" style={{ width: `${pct}%` }}></div>
      </div>
      <div className="text-xs text-text-muted text-right mb-5">Question {currentQ + 1} / {totalQ}</div>

      <div className="glass-card p-6 md:p-8 mb-5 animate-[fadeSlideIn_0.4s_ease]">
        <div className="text-[0.7rem] uppercase tracking-[0.12em] text-accent-violet font-semibold mb-2.5">
          Question {currentQ + 1}
          {isMixedExam && q._subjectTag && (
            <span className="inline-block text-[0.6rem] px-2 py-0.5 rounded-md font-semibold ml-2 align-middle uppercase tracking-wider" style={{ background: `${q._subjectColor}22`, color: q._subjectColor }}>
              {q._subjectTag}
            </span>
          )}
        </div>
        <div className="text-base md:text-lg font-medium leading-relaxed text-text-primary mb-4">{q.q}</div>
        
        {q.img && (
          <div className="mt-4">
            <img 
              src={q.img} 
              alt="Question diagram" 
              className="max-w-full h-auto rounded-xl border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] transition-all duration-300 cursor-zoom-in hover:scale-[1.02] hover:shadow-[0_12px_40px_rgba(99,102,241,0.2)] block"
              onClick={() => setDiagramModal(q.img)}
            />
            <div className="text-[0.7rem] text-text-muted mt-2 text-center italic tracking-wide">📎 Reference diagram — click to enlarge</div>
          </div>
        )}

        <div className="flex flex-col gap-2.5 mt-5">
          {shuffledOptions.map((o, i) => {
            let btnClass = "bg-white/5 border-[1.5px] border-white/10 rounded-xl p-3.5 md:p-4 cursor-pointer text-left text-sm text-text-primary transition-all duration-300 flex items-start gap-3 relative ";
            let letterClass = "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 bg-white/5 text-text-muted transition-all duration-300 ";
            
            if (isLocked) {
              btnClass += " cursor-default pointer-events-none ";
              const isCorrectOpt = o.i === q.ans;
              const isUserOpt = i === selectedOpt;
              
              if (isCorrectOpt) {
                btnClass += " !border-accent-emerald !bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.15)] ";
                letterClass += " !bg-accent-emerald !text-white ";
              } else if (isUserOpt && !isCorrectOpt) {
                btnClass += " !border-accent-rose !bg-rose-500/10 shadow-[0_0_20px_rgba(244,63,94,0.15)] ";
                letterClass += " !bg-accent-rose !text-white ";
              }
            } else {
              if (i === selectedOpt) {
                btnClass += " border-accent-indigo bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.1)] ";
                letterClass += " bg-accent-indigo text-white ";
              } else {
                btnClass += " hover:bg-indigo-500/5 hover:border-indigo-500/25 ";
              }
            }

            return (
              <button 
                key={i} 
                className={btnClass}
                onClick={() => setSelectedOpt(i)}
                disabled={isLocked}
              >
                <span className={letterClass}>{letters[i]}</span>
                <span className="pt-0.5 leading-relaxed">{o.v}</span>
              </button>
            );
          })}
        </div>
      </div>

      {isLocked && (
        <div className="mt-4 p-4 md:p-5 rounded-xl bg-indigo-500/5 border border-indigo-500/10 text-sm text-indigo-200 leading-relaxed animate-[fadeSlideIn_0.4s_ease]">
          <strong className="text-accent-indigo font-semibold">Explanation:</strong> {q.exp}
        </div>
      )}

      <button 
        className={`w-full p-3.5 mt-4 border-none rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 shadow-lg text-white ${
          !isLocked ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_30px_rgba(99,102,241,0.45)] hover:-translate-y-px' 
          : 'bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-[0_4px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_6px_30px_rgba(16,185,129,0.45)] hover:-translate-y-px'
        } disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none`}
        disabled={selectedOpt === -1}
        onClick={handleAction}
      >
        {!isLocked ? 'Lock Answer' : (currentQ < totalQ - 1 ? 'Next Question →' : 'View Results')}
      </button>

      {/* Diagram Modal */}
      {diagramModal && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-zoom-out animate-[fadeIn_0.3s_ease] p-5"
          onClick={() => setDiagramModal(null)}
        >
          <img src={diagramModal} alt="Enlarged diagram" className="max-w-[95vw] max-h-[95vh] rounded-xl shadow-[0_0_60px_rgba(99,102,241,0.3)]" />
        </div>
      )}
    </div>
  );
}
