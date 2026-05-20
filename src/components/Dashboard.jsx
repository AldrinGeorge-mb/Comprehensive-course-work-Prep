import React from 'react';
import { SUBJECTS } from '../data/questions';

export default function Dashboard({ startQuiz, startReview }) {

  const subjectColors = ['#6366f1', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b'];

  const handleMixedExam = () => {
    const subjectNames = ['DSA', 'OS', 'COA', 'DBMS', 'FLAT'];
    let mixedQuestions = [];
    SUBJECTS.forEach((s, i) => {
      const pool = [...s.questions].sort(() => Math.random() - 0.5).slice(0, 10);
      pool.forEach(q => {
        q._subjectTag   = subjectNames[i];
        q._subjectColor = subjectColors[i];
      });
      mixedQuestions.push(...pool);
    });
    startQuiz(
      { id: 'mixed', name: 'Mixed Exam Mode', icon: '📝', color: '#f43f5e', questions: mixedQuestions },
      50, true
    );
  };

  return (
    <div className="anim-fade-up">

      {/* ── Header ── */}
      <header className="text-center py-10 pb-6">
        <h1
          className="text-gradient font-black tracking-tight"
          style={{ fontSize: 'clamp(1.8rem,4.5vw,2.9rem)', letterSpacing: '-0.02em' }}
        >
          KTU S6 CCW Master
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '8px' }}>
          Comprehensive Course Work — Exam Preparation
        </p>
        <div style={{ marginTop: '14px' }}>
          <span className="badge-pill">300 Questions · 5 Subjects</span>
        </div>
      </header>

      {/* ── Subject Grid ── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '18px',
          marginTop: '10px',
        }}
      >
        {SUBJECTS.map((s, idx) => (
          <div
            key={s.id}
            className="glass-card"
            style={{ padding: '26px 22px' }}
          >
            {/* Gradient accent overlay */}
            <div
              style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(135deg, ${s.color}18, transparent 65%)`,
                borderRadius: '18px',
                pointerEvents: 'none',
                opacity: 0,
                transition: 'opacity 0.35s',
              }}
              className="card-overlay"
            />

            {/* Icon */}
            <div
              style={{
                width: 50, height: 50, borderRadius: 13,
                background: `${s.color}20`,
                color: s.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.45rem',
                marginBottom: 16,
                position: 'relative', zIndex: 1,
              }}
            >
              {s.icon}
            </div>

            <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 5, position: 'relative', zIndex: 1 }}>
              {s.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', position: 'relative', zIndex: 1 }}>
              {s.desc}
            </div>

            {/* Meta chips */}
            <div style={{ display: 'flex', gap: 8, marginTop: 14, marginBottom: 16, position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 8 }}>
                {s.questions.length} Questions
              </span>
              <span style={{ fontSize: '0.68rem', color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '3px 10px', borderRadius: 8 }}>
                MCQ
              </span>
            </div>

            {/* Mode buttons */}
            <div style={{ display: 'flex', gap: 8, position: 'relative', zIndex: 1 }}>
              <button className="mode-btn" onClick={() => startQuiz(s, 10)}>10 Qs</button>
              <button className="mode-btn" onClick={() => startQuiz(s, 30)}>30 Qs</button>
              <button className="mode-btn" onClick={() => startQuiz(s, s.questions.length)}>All {s.questions.length}</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Mixed Exam Card ── */}
      <div
        onClick={handleMixedExam}
        style={{
          marginTop: 18,
          background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(244,63,94,0.07))',
          backdropFilter: 'blur(24px)',
          border: '1px solid rgba(244,63,94,0.18)',
          borderRadius: 18,
          padding: '26px 24px',
          cursor: 'pointer',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1), border-color 0.35s, box-shadow 0.35s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.borderColor = 'rgba(244,63,94,0.45)';
          e.currentTarget.style.boxShadow = '0 0 40px rgba(244,63,94,0.15), 0 20px 60px rgba(0,0,0,0.4)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = '';
          e.currentTarget.style.borderColor = 'rgba(244,63,94,0.18)';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              width: 58, height: 58, borderRadius: 15,
              background: 'linear-gradient(135deg, rgba(244,63,94,0.22), rgba(99,102,241,0.22))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.7rem', flexShrink: 0,
            }}
          >
            📝
          </div>

          <div style={{ flex: 1, minWidth: 200 }}>
            <div className="text-gradient-rose" style={{ fontSize: '1.12rem', fontWeight: 800, marginBottom: 4 }}>
              Mixed Exam Mode
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
              Simulates the actual CCW exam — 50 random questions, 10 from each subject. Different every time.
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
              {['🔗 DSA ×10', '⚙️ OS ×10', '🖥️ COA ×10', '🗄️ DBMS ×10', '🤖 FLAT ×10'].map(tag => (
                <span key={tag} style={{ fontSize: '0.63rem', padding: '3px 9px', borderRadius: 7, background: 'rgba(255,255,255,0.05)', color: '#94a3b8', fontWeight: 600 }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="pulse-dot" style={{ display: 'none' }} />
        </div>
      </div>

      {/* ── Review Link ── */}
      <div style={{ textAlign: 'center', marginTop: 28, marginBottom: 8 }}>
        <button
          onClick={startReview}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', fontSize: '0.82rem', textDecoration: 'underline',
            transition: 'color 0.2s',
            fontFamily: 'inherit',
          }}
          onMouseEnter={e => e.target.style.color = '#f1f5f9'}
          onMouseLeave={e => e.target.style.color = '#64748b'}
        >
          📚 View Master Database (All Questions)
        </button>
      </div>
    </div>
  );
}
