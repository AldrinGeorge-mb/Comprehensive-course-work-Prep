import React, { useEffect, useState } from 'react';

export default function ResultsView({ subject, totalQ, userAnswers, mistakes, goHome }) {
  const score = userAnswers.filter(a => a.correct).length;
  const wrong = totalQ - score;
  const pct = (score / totalQ) * 100;
  
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedDeg, setAnimatedDeg] = useState(0);

  const color = pct >= 70 ? '#10b981' : pct >= 40 ? '#f59e0b' : '#f43f5e';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Animate the circle
    setTimeout(() => {
      setAnimatedDeg((pct / 100) * 360);
    }, 100);

    // Animate the number
    let count = 0;
    const interval = setInterval(() => {
      if (score === 0) {
        clearInterval(interval);
        return;
      }
      count++;
      setAnimatedScore(count);
      if (count >= score) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [score, pct]);

  return (
    <div id="results-view" className="animate-[fadeIn_0.5s_ease]">
      <div className="text-center py-10 pb-5">
        <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-purple-500">
          {subject?.name}
        </h1>
        <p className="text-text-secondary mt-2">Quiz Complete</p>
      </div>

      <div 
        className="w-44 h-44 rounded-full flex flex-col items-center justify-center mx-auto my-8 relative"
        style={{
          '--score-color': color,
          '--score-deg': `${animatedDeg}deg`,
        }}
      >
        {/* CSS Trick for the conic gradient border using a pseudo element equivalent in plain div */}
        <div className="absolute -inset-1 rounded-full p-1" style={{
          background: `conic-gradient(var(--score-color) var(--score-deg), rgba(255,255,255,0.06) 0)`,
          WebkitMask: `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude'
        }}></div>
        
        <div className="text-5xl font-black leading-none" style={{ color: color }}>
          {animatedScore}
        </div>
        <div className="text-xs text-text-muted mt-1">out of {totalQ}</div>
      </div>

      <div className="flex gap-3 justify-center mt-4 flex-wrap">
        <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-emerald-500/20 text-accent-emerald">
          ✓ {score} Correct
        </span>
        <span className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-rose-500/20 text-accent-rose">
          ✗ {wrong} Wrong
        </span>
      </div>

      {mistakes.length > 0 && (
        <div className="glass-card p-6 md:p-8 mt-6">
          <div className="text-lg font-bold mb-4 flex items-center gap-2">📋 Mistakes Review</div>
          <div>
            {mistakes.map((m, i) => (
              <div key={i} className={`py-4 ${i !== mistakes.length - 1 ? 'border-b border-white/5' : ''}`}>
                <div className="text-sm font-medium mb-2 text-text-primary">{i + 1}. {m.q}</div>
                <div className="text-xs flex flex-col gap-1">
                  <span className="text-accent-rose">Your answer: {m.yourAns}</span>
                  <span className="text-accent-emerald">Correct answer: {m.correctAns}</span>
                  <span className="text-text-muted italic mt-1">{m.exp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button 
        onClick={goHome}
        className="block w-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none py-3.5 px-8 rounded-xl text-sm font-semibold mt-6 cursor-pointer transition-all duration-300 shadow-[0_4px_20px_rgba(99,102,241,0.3)] hover:shadow-[0_6px_30px_rgba(99,102,241,0.45)] hover:-translate-y-px"
      >
        Return to Dashboard
      </button>
    </div>
  );
}
