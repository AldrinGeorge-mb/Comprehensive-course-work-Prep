import React from 'react';
import { SUBJECTS } from '../data/questions';

export default function Dashboard({ startQuiz, startReview }) {
  
  const handleMixedExam = () => {
    const subjectNames = ['DSA', 'OS', 'COA', 'DBMS', 'FLAT'];
    const subjectColors = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];
    
    let mixedQuestions = [];
    SUBJECTS.forEach((s, i) => {
      // Pick 10 random from each
      const pool = [...s.questions].sort(() => Math.random() - 0.5).slice(0, 10);
      pool.forEach(q => {
        q._subjectTag = subjectNames[i];
        q._subjectColor = subjectColors[i];
      });
      mixedQuestions.push(...pool);
    });

    startQuiz({ 
      id: 'mixed', 
      name: 'Mixed Exam Mode', 
      icon: '📝', 
      color: '#f43f5e', 
      questions: mixedQuestions 
    }, 50, true);
  };

  return (
    <div id="dashboard-view">
      <div className="text-center py-10 pb-5">
        <h1 className="text-3xl md:text-5xl font-black text-gradient tracking-tight">
          KTU S6 CCW Master Dashboard
        </h1>
        <p className="text-text-secondary text-sm md:text-base mt-2 font-normal">
          Comprehensive Course Work — Exam Preparation
        </p>
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest bg-indigo-500/15 text-indigo-300 border border-indigo-500/20 mt-3">
          300 Questions • 5 Subjects
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
        {SUBJECTS.map((s, idx) => (
          <div key={s.id} className="glass-card p-6 flex flex-col group cursor-pointer" style={{'--card-accent': `${s.color}22`}}>
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{ background: `linear-gradient(135deg, ${s.color}22, transparent 60%)`}}></div>
            
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 relative z-10" 
                 style={{ backgroundColor: `${s.color}22`, color: s.color }}>
              {s.icon}
            </div>
            
            <div className="text-lg font-bold mb-1.5 relative z-10">{s.name}</div>
            <div className="text-xs text-text-muted relative z-10 flex-grow">{s.desc}</div>
            
            <div className="flex items-center gap-2 mt-4 mb-4 relative z-10">
              <span className="text-[0.7rem] text-text-secondary bg-white/5 px-2.5 py-1 rounded-lg">50 Questions Total</span>
              <span className="text-[0.7rem] text-text-secondary bg-white/5 px-2.5 py-1 rounded-lg">MCQ</span>
            </div>
            
            <div className="flex gap-2 relative z-10">
              <button className="glass-btn flex-1 py-2 text-xs font-semibold text-text-secondary" onClick={() => startQuiz(s, 10)}>10 Qs</button>
              <button className="glass-btn flex-1 py-2 text-xs font-semibold text-text-secondary" onClick={() => startQuiz(s, 30)}>30 Qs</button>
              <button className="glass-btn flex-1 py-2 text-xs font-semibold text-text-secondary" onClick={() => startQuiz(s, 50)}>All 50</button>
            </div>
          </div>
        ))}

        {/* Mixed Exam Card */}
        <div 
          onClick={handleMixedExam}
          className="col-span-1 md:col-span-2 lg:col-span-3 bg-gradient-to-br from-indigo-500/10 to-rose-500/10 backdrop-blur-md border border-rose-500/20 rounded-2xl p-6 cursor-pointer transition-all duration-500 relative overflow-hidden group hover:-translate-y-1 hover:border-rose-500/40 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)] mt-2">
          
          <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="flex flex-col md:flex-row items-center gap-5 relative z-10 text-center md:text-left">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl shrink-0 bg-gradient-to-br from-rose-500/20 to-indigo-500/20">
              📝
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-br from-rose-400 to-indigo-500">
                Mixed Exam Mode
              </div>
              <div className="text-xs text-text-muted">
                Simulates the actual CCW exam — 50 random questions, 10 from each subject. Different every time.
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-1.5 mt-2.5">
                {['🔗 DSA', '⚙️ OS', '🖥️ COA', '🗄️ DBMS', '🤖 FLAT'].map(tag => (
                  <span key={tag} className="text-[0.65rem] px-2 py-0.5 rounded-md font-semibold bg-white/5 text-text-secondary">
                    {tag} ×10
                  </span>
                ))}
              </div>
            </div>
            <div className="relative w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0 hidden md:block">
              <div className="absolute -inset-1 rounded-full border-2 border-rose-500/40 animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <button onClick={startReview} className="text-sm text-text-secondary underline hover:text-white transition-colors">
          Master Database Review Mode
        </button>
      </div>
    </div>
  );
}
