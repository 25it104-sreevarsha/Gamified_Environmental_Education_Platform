import React, { useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { allBadges } from '../data/quizzes';

const avatarOptions = ['🌿', '🌱', '🦋', '🌊', '☀️', '🌍', '🦜', '🌸', '🌻', '⚡', '🌺', '🐝'];

export default function Profile() {
  const { state, dispatch } = useGame();
  const { user, badges, completedQuizzes, completedChallenges } = state;
  const [editName, setEditName] = useState(false);
  const [nameInput, setNameInput] = useState(user.name);
  const accuracy = state.totalQuestions > 0 ? Math.round((state.correctAnswers / state.totalQuestions) * 100) : 0;

  const saveProfile = () => {
    if (nameInput.trim()) {
      dispatch({ type: 'UPDATE_NAME', payload: nameInput.trim() });
    }
    setEditName(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <h1 style={{ fontSize: 28, color: '#e8f5e9', marginBottom: 24 }}>👤 Your Profile</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        {/* Left: Identity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ padding: '28px', textAlign: 'center' }}>
            <div style={{ fontSize: 72, marginBottom: 12 }}>{user.avatar}</div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {avatarOptions.map(a => (
                <button key={a} onClick={() => dispatch({ type: 'LOAD_STATE', payload: { ...state, user: { ...user, avatar: a }, leaderboard: state.leaderboard.map(e => e.isUser ? { ...e, avatar: a } : e) } })}
                  style={{
                    fontSize: 22, padding: '4px', background: user.avatar === a ? 'rgba(34,197,94,0.2)' : 'transparent',
                    border: user.avatar === a ? '1px solid rgba(34,197,94,0.4)' : '1px solid transparent',
                    borderRadius: 8, cursor: 'pointer',
                  }}>
                  {a}
                </button>
              ))}
            </div>

            {editName ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <input value={nameInput} onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && saveProfile()}
                  style={{
                    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 10, padding: '8px 12px', color: '#e8f5e9', fontSize: 14, textAlign: 'center',
                  }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={saveProfile} className="btn-primary" style={{ flex: 1, padding: '8px', justifyContent: 'center' }}>Save</button>
                  <button onClick={() => setEditName(false)} className="btn-secondary" style={{ flex: 1, padding: '8px', justifyContent: 'center' }}>Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 20, color: '#e8f5e9', marginBottom: 4 }}>{user.name}</h2>
                <button onClick={() => setEditName(true)} style={{ fontSize: 12, color: '#6b7280', background: 'none', marginBottom: 16 }}>
                  ✏️ Edit name
                </button>
              </>
            )}

            <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#22c55e', fontFamily: 'Space Grotesk' }}>{user.level}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Level</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#fbbf24', fontFamily: 'Space Grotesk' }}>{user.streak}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Day Streak</div>
              </div>
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: '#a78bfa', fontFamily: 'Space Grotesk' }}>{user.xp}</div>
                <div style={{ fontSize: 11, color: '#6b7280' }}>Total XP</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: 14, color: '#9ca3af', marginBottom: 14 }}>📊 Stats</h3>
            {[
              { label: 'Quizzes Completed', value: completedQuizzes.length },
              { label: 'Challenges Done', value: completedChallenges.length },
              { label: 'Questions Answered', value: state.totalQuestions },
              { label: 'Accuracy Rate', value: `${accuracy}%` },
              { label: 'Badges Earned', value: `${badges.length} / ${allBadges.length}` },
            ].map(s => (
              <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: 13, color: '#6b7280' }}>{s.label}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#e8f5e9' }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Activity */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Badges */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: 16, color: '#e8f5e9', marginBottom: 16 }}>🏅 Badges ({badges.length}/{allBadges.length})</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: 10 }}>
              {allBadges.map(b => {
                const earned = badges.find(e => e.id === b.id);
                return (
                  <div key={b.id} style={{
                    padding: '12px 8px', borderRadius: 10, textAlign: 'center',
                    background: earned ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
                    border: `1px solid ${earned ? b.color + '30' : 'rgba(255,255,255,0.05)'}`,
                    opacity: earned ? 1 : 0.35,
                  }}>
                    <div style={{ fontSize: 26, marginBottom: 4, filter: earned ? 'none' : 'grayscale(1)' }}>{b.icon}</div>
                    <div style={{ fontSize: 10, fontWeight: 600, color: earned ? b.color : '#6b7280' }}>{b.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          {(completedQuizzes.length > 0 || completedChallenges.length > 0) && (
            <div className="card" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: 16, color: '#e8f5e9', marginBottom: 16 }}>📋 Recent Activity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[...completedQuizzes.map(q => ({ type: 'quiz', ...q })), ...completedChallenges.map(c => ({ type: 'challenge', ...c }))]
                  .slice(-8).reverse()
                  .map((item, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                      background: 'rgba(255,255,255,0.03)', borderRadius: 10,
                    }}>
                      <span style={{ fontSize: 20 }}>{item.type === 'quiz' ? '🎯' : '⚡'}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: '#e8f5e9' }}>
                          {item.type === 'quiz' ? `Completed ${item.id} quiz (${item.correct}/${item.total})` : item.title}
                        </div>
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#22c55e' }}>+{item.xp} XP</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
