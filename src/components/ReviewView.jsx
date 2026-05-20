import React, { useState, useMemo } from 'react';
import { SUBJECTS } from '../data/questions';

const SUB_COLORS = ['#6366f1','#8b5cf6','#3b82f6','#10b981','#f59e0b'];
const LETTERS = ['A','B','C','D'];

export default function ReviewView({ goHome }) {
  const [activeSubj, setActiveSubj] = useState(0);
  const [openIdx, setOpenIdx]       = useState(null);
  const [search, setSearch]         = useState('');

  const subject = SUBJECTS[activeSubj];
  const color   = SUB_COLORS[activeSubj];

  const filtered = useMemo(() => {
    if (!search.trim()) return subject.questions;
    const q = search.toLowerCase();
    return subject.questions.filter(q2 =>
      q2.q.toLowerCase().includes(q) ||
      q2.options.some(o => o.toLowerCase().includes(q))
    );
  }, [subject, search]);

  return (
    <div style={{ paddingTop: 36, paddingBottom: 20 }}>

      {/* ── Header ── */}
      <div className="anim-up" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28, flexWrap:'wrap', gap:12 }}>
        <h2 className="t-section">📚 Question Database</h2>
        <button className="btn btn-ghost" onClick={goHome}>← Back</button>
      </div>

      {/* ── Subject Tabs ── */}
      <div className="anim-up delay-1" style={{
        display:'flex', gap:8, overflowX:'auto', paddingBottom:4, marginBottom:24,
        scrollbarWidth:'none',
      }}>
        {SUBJECTS.map((s, i) => (
          <button
            key={s.id}
            onClick={() => { setActiveSubj(i); setOpenIdx(null); setSearch(''); }}
            style={{
              padding:'9px 16px', borderRadius:12, whiteSpace:'nowrap',
              border: activeSubj === i ? `1px solid ${SUB_COLORS[i]}55` : '1px solid rgba(255,255,255,0.06)',
              background: activeSubj === i ? `${SUB_COLORS[i]}18` : 'rgba(255,255,255,0.03)',
              color: activeSubj === i ? SUB_COLORS[i] : '#4a5568',
              fontSize:'0.78rem', fontWeight:700, cursor:'pointer',
              transition:'all 0.22s',
              fontFamily:'inherit',
            }}
          >
            {s.icon} {s.name.split(' ')[0]}
            <span style={{
              marginLeft:7, fontSize:'0.63rem', padding:'1px 7px', borderRadius:6,
              background: activeSubj === i ? `${SUB_COLORS[i]}25` : 'rgba(255,255,255,0.04)',
              color: activeSubj === i ? SUB_COLORS[i] : '#2d3748',
            }}>
              {s.questions.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Search bar ── */}
      <div className="anim-up delay-2" style={{ marginBottom:20, position:'relative' }}>
        <span style={{
          position:'absolute', left:14, top:'50%', transform:'translateY(-50%)',
          color:'#2d3748', fontSize:'0.9rem',
        }}>🔍</span>
        <input
          type="text"
          value={search}
          onChange={e => { setSearch(e.target.value); setOpenIdx(null); }}
          placeholder={`Search ${subject.name}...`}
          style={{
            width:'100%', padding:'11px 16px 11px 40px',
            background:'rgba(12,16,42,0.7)', border:'1px solid rgba(255,255,255,0.07)',
            borderRadius:12, color:'#e0e7ff', fontSize:'0.88rem',
            fontFamily:'inherit', outline:'none',
            transition:'border-color 0.22s',
          }}
          onFocus={e => e.target.style.borderColor = `${color}55`}
          onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.07)'}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
              background:'none', border:'none', color:'#4a5568', cursor:'pointer', fontSize:'1rem', padding:4,
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* ── Result count ── */}
      <div style={{ marginBottom:14, display:'flex', alignItems:'center', gap:8 }}>
        <span className="t-label">{filtered.length} question{filtered.length !== 1 ? 's' : ''}</span>
        {search && <span style={{ fontSize:'0.68rem', color:'#4a5568' }}>matching "{search}"</span>}
      </div>

      {/* ── Accordion Questions ── */}
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'40px 0', color:'#2d3748', fontSize:'0.9rem' }}>
            No questions match your search.
          </div>
        )}

        {filtered.map((q, qi) => {
          const uid    = `${activeSubj}-${qi}`;
          const isOpen = openIdx === uid;
          const origIdx = subject.questions.indexOf(q);

          return (
            <div
              key={uid}
              className={`review-item ${isOpen ? 'is-open' : ''}`}
              onClick={() => setOpenIdx(isOpen ? null : uid)}
            >
              {/* ── Row ── */}
              <div style={{ padding:'14px 18px', display:'flex', alignItems:'flex-start', gap:12 }}>
                {/* Number */}
                <span className="t-mono" style={{
                  minWidth:32, height:32, borderRadius:9,
                  background:`${color}14`, color,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:'0.68rem', fontWeight:800, flexShrink:0,
                  border:`1px solid ${color}22`,
                }}>
                  {origIdx + 1}
                </span>

                {/* Question text */}
                <div
                  style={{ flex:1, fontSize:'0.875rem', fontWeight:500, lineHeight:1.6, color:'#c4cfe8' }}
                  dangerouslySetInnerHTML={{ __html: q.q }}
                />

                {/* Chevron */}
                <span style={{
                  color:'#2d3748', fontSize:'0.75rem', flexShrink:0, marginTop:2,
                  transition:'transform 0.25s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  display:'block',
                }}>▾</span>
              </div>

              {/* ── Expanded ── */}
              {isOpen && (
                <div
                  style={{ padding:'0 18px 18px', borderTop:'1px solid rgba(255,255,255,0.04)' }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Diagram */}
                  {q.img && (
                    <img
                      src={q.img} alt="Diagram"
                      style={{ maxWidth:'100%', maxHeight:280, borderRadius:10, margin:'14px 0', border:'1px solid rgba(255,255,255,0.08)' }}
                    />
                  )}

                  {/* Options */}
                  <div style={{ display:'flex', flexDirection:'column', gap:7, marginTop:14 }}>
                    {q.options.map((opt, oi) => {
                      const correct = oi === q.ans;
                      return (
                        <div
                          key={oi}
                          style={{
                            padding:'9px 14px', borderRadius:10,
                            display:'flex', alignItems:'flex-start', gap:10,
                            background: correct ? 'rgba(16,185,129,0.09)' : 'rgba(255,255,255,0.02)',
                            border: correct ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.04)',
                          }}
                        >
                          <span style={{
                            minWidth:26, height:26, borderRadius:7,
                            background: correct ? '#10b981' : 'rgba(255,255,255,0.04)',
                            color: correct ? '#fff' : '#4a5568',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            fontSize:'0.65rem', fontWeight:800, flexShrink:0,
                            fontFamily:'JetBrains Mono, monospace',
                          }}>
                            {LETTERS[oi]}
                          </span>
                          <span style={{ fontSize:'0.84rem', color: correct ? '#6ee7b7' : '#64748b', lineHeight:1.5 }}>
                            {opt}
                          </span>
                          {correct && <span style={{ marginLeft:'auto', color:'#10b981', flexShrink:0, fontWeight:700, fontSize:'0.8rem' }}>✓</span>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation */}
                  <div style={{
                    marginTop:14, padding:'13px 16px', borderRadius:12,
                    background:'rgba(99,102,241,0.07)', border:'1px solid rgba(99,102,241,0.14)',
                    position:'relative', overflow:'hidden',
                  }}>
                    <div style={{
                      position:'absolute', left:0, top:0, bottom:0, width:3,
                      background:`linear-gradient(180deg, ${color}, #06b6d4)`,
                      borderRadius:'0 2px 2px 0',
                    }}/>
                    <span style={{ color:'#818cf8', fontWeight:800, fontSize:'0.78rem' }}>Explanation: </span>
                    <span style={{ color:'#a5b4fc', fontSize:'0.8rem', lineHeight:1.7 }}>{q.exp}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
