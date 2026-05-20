import React from 'react';
import { SUBJECTS } from '../data/questions';

export default function ReviewView({ goHome }) {
  const letters = ['A','B','C','D'];
  return (
    <div id="review-view" className="animate-[fadeIn_0.5s_ease]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <h2 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-indigo-500 to-purple-500">
          Master Database Review
        </h2>
        <button 
          className="bg-white/5 border border-border-card text-text-secondary px-4 py-2 rounded-xl text-sm transition-all duration-300 hover:bg-white/10 hover:text-white flex items-center gap-1.5" 
          onClick={goHome}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div>
        {SUBJECTS.map((s, sIdx) => (
          <div key={s.id} className="mb-10">
            <h3 
              className="mt-8 mb-4 pb-2 border-b font-bold text-lg" 
              style={{ color: s.color, borderColor: `${s.color}44` }}
            >
              {s.name} ({s.questions.length} Questions)
            </h3>
            
            {s.questions.map((q, qIdx) => (
              <div key={qIdx} className="glass-card p-5 mb-4">
                <div className="font-semibold text-sm mb-3">Q{qIdx+1}. {q.q}</div>
                {q.img && (
                  <img src={q.img} alt="Question Diagram" className="max-w-xs h-auto rounded-lg mb-3 border border-white/10" />
                )}
                <div className="flex flex-col gap-2">
                  {q.options.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.ans;
                    return (
                      <div 
                        key={optIdx} 
                        className={`p-2.5 rounded-lg text-xs ${isCorrect ? 'bg-emerald-500/15 border border-emerald-500 text-white' : 'bg-white/5 border border-transparent'}`}
                      >
                        <strong>{letters[optIdx]}.</strong> {opt} {isCorrect && ' ✓'}
                      </div>
                    );
                  })}
                </div>
                <div className="mt-3 text-xs text-text-muted italic">
                  <strong>Explanation:</strong> {q.exp}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
