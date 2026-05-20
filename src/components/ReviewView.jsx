import React, { useState } from 'react';
import { SUBJECTS } from '../data/questions';

export default function ReviewView({ goHome }) {
  const letters = ['A', 'B', 'C', 'D'];
  const [openIdx, setOpenIdx] = useState(null); // track which question is expanded

  return (
    <div className="anim-fade-up">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
        <h2 className="text-gradient font-black" style={{ fontSize: '1.5rem' }}>
          📚 Master Database Review
        </h2>
        <button className="btn-back" onClick={goHome}>← Back to Dashboard</button>
      </div>

      {SUBJECTS.map((s) => (
        <div key={s.id} style={{ marginBottom: 40 }}>
          {/* Subject Header */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 16, paddingBottom: 10,
              borderBottom: `1px solid ${s.color}33`,
            }}
          >
            <span style={{ fontSize: '1.3rem' }}>{s.icon}</span>
            <h3 style={{ color: s.color, fontWeight: 700, fontSize: '1.05rem' }}>
              {s.name}
            </h3>
            <span style={{ fontSize: '0.68rem', padding: '2px 9px', borderRadius: 7, background: `${s.color}18`, color: s.color, fontWeight: 600 }}>
              {s.questions.length} Qs
            </span>
          </div>

          {/* Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {s.questions.map((q, qIdx) => {
              const uid = `${s.id}-${qIdx}`;
              const isOpen = openIdx === uid;
              return (
                <div
                  key={qIdx}
                  className="glass-card"
                  style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                  onClick={() => setOpenIdx(isOpen ? null : uid)}
                >
                  {/* Question row */}
                  <div
                    style={{
                      padding: '14px 18px',
                      display: 'flex', alignItems: 'flex-start', gap: 12,
                    }}
                  >
                    <span
                      style={{
                        minWidth: 28, height: 28, borderRadius: 8,
                        background: `${s.color}18`, color: s.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '0.7rem', fontWeight: 700, flexShrink: 0,
                      }}
                    >
                      {qIdx + 1}
                    </span>
                    <div
                      style={{ flex: 1, fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.55, color: '#f1f5f9' }}
                      dangerouslySetInnerHTML={{ __html: q.q }}
                    />
                    <span style={{ color: '#64748b', fontSize: '0.85rem', flexShrink: 0, marginLeft: 4, transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : '' }}>
                      ▾
                    </span>
                  </div>

                  {/* Expanded content */}
                  {isOpen && (
                    <div
                      style={{ padding: '0 18px 16px', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                      onClick={e => e.stopPropagation()}
                    >
                      {q.img && (
                        <img
                          src={q.img}
                          alt="Diagram"
                          style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 10, margin: '12px 0 10px', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      )}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 10 }}>
                        {q.options.map((opt, oi) => {
                          const isCorrect = oi === q.ans;
                          return (
                            <div
                              key={oi}
                              style={{
                                padding: '9px 14px',
                                borderRadius: 10,
                                fontSize: '0.85rem',
                                background: isCorrect ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.03)',
                                border: isCorrect ? '1px solid rgba(16,185,129,0.4)' : '1px solid transparent',
                                color: isCorrect ? '#6ee7b7' : '#94a3b8',
                                display: 'flex', alignItems: 'flex-start', gap: 8,
                              }}
                            >
                              <strong style={{ minWidth: 18, color: isCorrect ? '#10b981' : '#64748b' }}>
                                {letters[oi]}.
                              </strong>
                              <span>{opt}</span>
                              {isCorrect && <span style={{ marginLeft: 'auto', color: '#10b981', flexShrink: 0 }}>✓</span>}
                            </div>
                          );
                        })}
                      </div>
                      <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 10, background: 'rgba(99,102,241,0.07)', border: '1px solid rgba(99,102,241,0.12)' }}>
                        <span style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.8rem' }}>Explanation: </span>
                        <span style={{ color: '#c7d2fe', fontSize: '0.82rem', lineHeight: 1.6 }}>{q.exp}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
