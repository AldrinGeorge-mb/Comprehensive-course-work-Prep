import React from 'react';
import { SUBJECTS } from '../data/questions';

const SUBJECT_GRADIENTS = [
  'linear-gradient(135deg,#6366f1,#8b5cf6)',
  'linear-gradient(135deg,#8b5cf6,#a78bfa)',
  'linear-gradient(135deg,#3b82f6,#06b6d4)',
  'linear-gradient(135deg,#10b981,#06b6d4)',
  'linear-gradient(135deg,#f59e0b,#f97316)',
];
const SUBJECT_GLOWS = [
  'rgba(99,102,241,0.25)',
  'rgba(139,92,246,0.25)',
  'rgba(59,130,246,0.25)',
  'rgba(16,185,129,0.25)',
  'rgba(245,158,11,0.25)',
];
const SUBJECT_BG = [
  'rgba(99,102,241,0.08)',
  'rgba(139,92,246,0.08)',
  'rgba(59,130,246,0.08)',
  'rgba(16,185,129,0.08)',
  'rgba(245,158,11,0.08)',
];

export default function Dashboard({ startQuiz, startReview }) {
  const SUB_NAMES   = ['DSA', 'OS', 'COA', 'DBMS', 'FLAT'];
  const SUB_COLORS  = ['#6366f1','#8b5cf6','#3b82f6','#10b981','#f59e0b'];

  const handleMixed = () => {
    let qs = [];
    SUBJECTS.forEach((s, i) => {
      const pool = [...s.questions].sort(() => Math.random() - 0.5).slice(0, 10);
      pool.forEach(q => { q._subjectTag = SUB_NAMES[i]; q._subjectColor = SUB_COLORS[i]; });
      qs.push(...pool);
    });
    startQuiz({ id:'mixed', name:'Mixed Exam Mode', icon:'📝', color:'#f43f5e', questions: qs }, 50, true);
  };

  const totalQuestions = SUBJECTS.reduce((a, s) => a + s.questions.length, 0);

  return (
    <div style={{ paddingTop: 60, paddingBottom: 20 }}>

      {/* ── Hero Header ── */}
      <header className="anim-up" style={{ textAlign:'center', marginBottom: 56 }}>
        {/* Top label */}
        <div style={{ marginBottom: 18 }}>
          <span className="chip chip-indigo">
            <span style={{ width:6, height:6, borderRadius:'50%', background:'#6366f1', display:'inline-block' }}/>
            KTU S6 · Comprehensive Course Work
          </span>
        </div>

        <h1 className="t-hero" style={{ marginBottom: 16 }}>
          Master Dashboard
        </h1>

        <p style={{ color:'#64748b', fontSize:'0.97rem', maxWidth:480, margin:'0 auto', lineHeight:1.7 }}>
          Your complete exam preparation hub — practise by subject or simulate the real CCW experience.
        </p>

        {/* Stats row */}
        <div style={{ display:'flex', justifyContent:'center', gap:24, marginTop:28, flexWrap:'wrap' }}>
          {[
            { num: totalQuestions, label: 'Total Questions' },
            { num: 5,              label: 'Subjects' },
            { num: '50',           label: 'Mixed Exam Size' },
          ].map(({ num, label }) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div className="t-mono" style={{ fontSize:'1.75rem', fontWeight:800, color:'#e0e7ff', lineHeight:1 }}>{num}</div>
              <div style={{ fontSize:'0.68rem', fontWeight:600, color:'#4a5568', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:4 }}>{label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* ── Subject Grid ── */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16, marginBottom:16 }}>
        {SUBJECTS.map((s, idx) => (
          <div
            key={s.id}
            className={`card subject-card anim-up delay-${idx + 1}`}
          >
            {/* Top gradient bar */}
            <div
              className="accent-bar"
              style={{ background: SUBJECT_GRADIENTS[idx] }}
            />

            {/* Subtle bg glow */}
            <div style={{
              position:'absolute', inset:0,
              background: `radial-gradient(ellipse at 20% 20%, ${SUBJECT_BG[idx]} 0%, transparent 65%)`,
              pointerEvents:'none',
            }}/>

            {/* Icon */}
            <div style={{
              width:52, height:52, borderRadius:14,
              background: SUBJECT_BG[idx],
              display:'flex', alignItems:'center', justifyContent:'center',
              fontSize:'1.5rem', marginBottom:18,
              position:'relative', zIndex:1,
              border: `1px solid ${s.color}22`,
            }}>
              {s.icon}
            </div>

            {/* Name */}
            <div style={{ fontWeight:800, fontSize:'1rem', marginBottom:5, position:'relative', zIndex:1, color:'#e0e7ff' }}>
              {s.name}
            </div>
            <div style={{ fontSize:'0.76rem', color:'#4a5568', lineHeight:1.5, marginBottom:18, position:'relative', zIndex:1 }}>
              {s.desc}
            </div>

            {/* Divider */}
            <div style={{ height:1, background:'rgba(255,255,255,0.05)', marginBottom:16 }}/>

            {/* Q count chip */}
            <div style={{ display:'flex', gap:7, marginBottom:14, position:'relative', zIndex:1 }}>
              <span style={{
                fontSize:'0.67rem', padding:'3px 9px', borderRadius:8,
                background:`${s.color}14`, color:s.color, fontWeight:700, border:`1px solid ${s.color}25`,
              }}>
                {s.questions.length} Questions
              </span>
              <span style={{
                fontSize:'0.67rem', padding:'3px 9px', borderRadius:8,
                background:'rgba(255,255,255,0.04)', color:'#64748b', fontWeight:700,
              }}>
                MCQ
              </span>
            </div>

            {/* Mode buttons */}
            <div style={{ display:'flex', gap:8, position:'relative', zIndex:1 }}>
              <button className="mode-btn" onClick={() => startQuiz(s, 10)}>10 Qs</button>
              <button className="mode-btn" onClick={() => startQuiz(s, 30)}>30 Qs</button>
              <button className="mode-btn" onClick={() => startQuiz(s, s.questions.length)}>All {s.questions.length}</button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Mixed Exam Card ── */}
      <div className="mixed-card anim-up delay-5" onClick={handleMixed} style={{ marginTop: 8 }}>
        {/* corner glow */}
        <div style={{ position:'absolute', top:-30, right:-30, width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle, rgba(244,63,94,0.1), transparent 70%)', pointerEvents:'none' }}/>

        <div style={{ display:'flex', alignItems:'center', gap:22, position:'relative', zIndex:1, flexWrap:'wrap' }}>
          {/* Icon */}
          <div style={{
            width:64, height:64, borderRadius:18, flexShrink:0,
            background:'linear-gradient(135deg,rgba(244,63,94,0.2),rgba(99,102,241,0.2))',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'1.9rem',
            border:'1px solid rgba(244,63,94,0.2)',
          }}>
            📝
          </div>

          <div style={{ flex:1, minWidth:200 }}>
            {/* Title */}
            <div style={{
              fontSize:'1.15rem', fontWeight:900, marginBottom:5,
              background:'linear-gradient(135deg,#f43f5e,#8b5cf6,#6366f1)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
            }}>
              Mixed Exam Mode
            </div>
            <div style={{ fontSize:'0.8rem', color:'#64748b', lineHeight:1.6, maxWidth:440 }}>
              Simulates the actual CCW exam — 50 random questions drawn equally from all five subjects in the exact exam order.
            </div>
            {/* Tags */}
            <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:12 }}>
              {SUBJECTS.map((s, i) => (
                <span key={s.id} style={{
                  fontSize:'0.62rem', padding:'3px 9px', borderRadius:7,
                  background:`${SUB_COLORS[i]}14`, color:SUB_COLORS[i], fontWeight:700,
                  border:`1px solid ${SUB_COLORS[i]}22`,
                }}>
                  {s.icon} {SUB_NAMES[i]} ×10
                </span>
              ))}
            </div>
          </div>

          {/* Arrow + pulse */}
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:10, flexShrink:0 }}>
            <div className="pulse-dot"/>
            <div style={{ fontSize:'1.4rem', color:'rgba(244,63,94,0.5)', marginTop:4 }}>→</div>
          </div>
        </div>
      </div>

      {/* ── Review link ── */}
      <div style={{ textAlign:'center', marginTop:32 }}>
        <button
          className="btn btn-ghost"
          onClick={startReview}
          style={{ fontSize:'0.8rem', padding:'9px 20px' }}
        >
          📚 View Full Question Database
        </button>
      </div>
    </div>
  );
}
