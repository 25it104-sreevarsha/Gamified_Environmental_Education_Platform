import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { challenges, challengeCategories } from '../data/challenges';
import { allBadges } from '../data/quizzes';

export default function Challenges() {
  const { state, dispatch } = useGame();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const filtered = activeFilter === 'all' ? challenges : challenges.filter(c => c.category === activeFilter);

  const handleComplete = (challenge) => {
    dispatch({ type: 'ADD_XP', payload: challenge.xp });
    dispatch({ type: 'COMPLETE_CHALLENGE', payload: { id: challenge.id, title: challenge.title, xp: challenge.xp, date: new Date().toISOString() } });

    const total = state.completedChallenges.length + 1;
    if (total >= 5) dispatch({ type: 'EARN_BADGE', payload: allBadges.find(b => b.id === 'challenge_5') });
    setSelected(null);
  };

  const isCompleted = (id) => state.completedChallenges.some(c => c.id === id);

  if (selected) {
    const c = selected;
    const done = isCompleted(c.id);
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 24px' }}>
        <button onClick={() => setSelected(null)} className="btn-secondary" style={{ padding: '7px 14px', marginBottom: 24 }}>
          ← Back
        </button>
        <div className="card" style={{ padding: '32px' }}>
          <div style={{ fontSize: 56, marginBottom: 16, textAlign: 'center' }}>{c.icon}</div>
          <h1 style={{ fontSize: 24, color: '#e8f5e9', textAlign: 'center', marginBottom: 8 }}>{c.title}</h1>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 24 }}>
            <span className="badge badge-green">+{c.xp} XP</span>
            <span className={`badge badge-${c.difficulty === 'Easy' ? 'teal' : c.difficulty === 'Hard' ? 'blue' : 'amber'}`}>{c.difficulty}</span>
            <span className="badge badge-purple">⏱ {c.duration}</span>
          </div>
          <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.7, marginBottom: 24, textAlign: 'center' }}>{c.description}</p>

          <div style={{ background: 'rgba(34,197,94,0.07)', borderRadius: 12, padding: '18px', marginBottom: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#22c55e', marginBottom: 12 }}>💡 Tips to Succeed</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
              {c.tips.map((tip, i) => (
                <li key={i} style={{ fontSize: 14, color: '#9ca3af', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: '#22c55e', flexShrink: 0 }}>✓</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div style={{ background: 'rgba(96,165,250,0.08)', borderRadius: 12, padding: '14px 18px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 22 }}>🌍</span>
            <div>
              <div style={{ fontSize: 12, color: '#9ca3af' }}>Environmental Impact</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#60a5fa' }}>{c.impact}</div>
            </div>
          </div>

          {done ? (
            <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(34,197,94,0.1)', borderRadius: 12 }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>✅</div>
              <div style={{ color: '#22c55e', fontWeight: 600 }}>Challenge Completed!</div>
            </div>
          ) : (
            <button className="btn-primary" onClick={() => handleComplete(c)} style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: 16 }}>
              ✅ Mark as Completed (+{c.xp} XP)
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, color: '#e8f5e9', marginBottom: 8 }}>⚡ Eco Challenges</h1>
        <p style={{ color: '#6b7280' }}>
          Take on real-world environmental actions. Complete challenges to earn XP and make a genuine impact.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="card" style={{ padding: '14px 20px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 22 }}>🏆</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#22c55e', fontFamily: 'Space Grotesk' }}>{state.completedChallenges.length}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Completed</div>
          </div>
        </div>
        <div className="card" style={{ padding: '14px 20px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 22 }}>⚡</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#a78bfa', fontFamily: 'Space Grotesk' }}>
              {state.completedChallenges.reduce((sum, c) => sum + c.xp, 0)}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>XP from Challenges</div>
          </div>
        </div>
        <div className="card" style={{ padding: '14px 20px', display: 'flex', gap: 10, alignItems: 'center' }}>
          <span style={{ fontSize: 22 }}>🌍</span>
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#60a5fa', fontFamily: 'Space Grotesk' }}>
              {challenges.length - state.completedChallenges.length}
            </div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Remaining</div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {challengeCategories.map(cat => (
          <button key={cat.id} onClick={() => setActiveFilter(cat.id)} style={{
            padding: '7px 14px', borderRadius: 100, fontSize: 13, fontWeight: 500,
            background: activeFilter === cat.id ? 'rgba(34,197,94,0.2)' : 'rgba(255,255,255,0.05)',
            color: activeFilter === cat.id ? '#22c55e' : '#9ca3af',
            border: `1px solid ${activeFilter === cat.id ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
            transition: 'all 0.15s',
          }}>
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Challenges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {filtered.map(c => {
          const done = isCompleted(c.id);
          return (
            <div key={c.id} className="card card-hover" onClick={() => setSelected(c)}
              style={{ padding: '20px', cursor: 'pointer', transition: 'all 0.2s', opacity: done ? 0.75 : 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                }}>{c.icon}</div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                  {done && <span style={{ fontSize: 11, color: '#22c55e' }}>✓ Done</span>}
                  <span className={`badge badge-${c.difficulty === 'Easy' ? 'green' : c.difficulty === 'Hard' ? 'blue' : 'amber'}`}>
                    {c.difficulty}
                  </span>
                </div>
              </div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: '#e8f5e9', marginBottom: 6 }}>{c.title}</h3>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14, lineHeight: 1.5 }}>
                {c.description.slice(0, 80)}...
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: '#9ca3af' }}>⏱ {c.duration}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#22c55e' }}>+{c.xp} XP</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
