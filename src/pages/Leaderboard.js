import React from 'react';
import { useGame } from '../contexts/GameContext';

const medals = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { state } = useGame();
  const sorted = [...state.leaderboard].sort((a, b) => b.xp - a.xp);
  const userRank = sorted.findIndex(e => e.isUser) + 1;
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, color: '#e8f5e9', marginBottom: 8 }}>🏆 Leaderboard</h1>
        <p style={{ color: '#6b7280' }}>Top eco learners this season. Your rank: #{userRank}</p>
      </div>

      {/* Top 3 Podium */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, marginBottom: 36 }}>
        {[top3[1], top3[0], top3[2]].map((entry, i) => {
          if (!entry) return null;
          const heights = [140, 180, 120];
          const rank = sorted.indexOf(entry) + 1;
          return (
            <div key={entry.id} style={{ textAlign: 'center', flex: '0 0 auto', width: 120 }}>
              <div style={{
                fontSize: 32, marginBottom: 8,
                animation: rank === 1 ? 'float 3s ease-in-out infinite' : 'none',
              }}>{entry.avatar}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#e8f5e9', marginBottom: 2 }}>{entry.name}</div>
              <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 10 }}>{entry.xp} XP</div>
              <div style={{
                height: heights[i], borderRadius: '12px 12px 0 0',
                background: rank === 1
                  ? 'linear-gradient(180deg, rgba(251,191,36,0.3), rgba(251,191,36,0.1))'
                  : rank === 2
                    ? 'linear-gradient(180deg, rgba(148,163,184,0.3), rgba(148,163,184,0.1))'
                    : 'linear-gradient(180deg, rgba(205,127,50,0.3), rgba(205,127,50,0.1))',
                border: `1px solid ${rank === 1 ? 'rgba(251,191,36,0.3)' : rank === 2 ? 'rgba(148,163,184,0.2)' : 'rgba(205,127,50,0.2)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
              }}>{medals[rank - 1]}</div>
            </div>
          );
        })}
      </div>

      {/* Rest of list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sorted.map((entry, idx) => {
          const rank = idx + 1;
          const isUser = entry.isUser;
          return (
            <div key={entry.id} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px',
              borderRadius: 14,
              background: isUser ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${isUser ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.06)'}`,
              transition: 'all 0.15s',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: rank <= 3 ? 'transparent' : 'rgba(255,255,255,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: rank <= 3 ? 22 : 14, fontWeight: 700,
                color: isUser ? '#22c55e' : '#9ca3af',
              }}>
                {rank <= 3 ? medals[rank - 1] : `#${rank}`}
              </div>
              <div style={{ fontSize: 28 }}>{entry.avatar}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: isUser ? '#4ade80' : '#e8f5e9' }}>
                  {entry.name} {isUser && <span style={{ fontSize: 11, color: '#22c55e' }}>(You)</span>}
                </div>
                <div style={{ fontSize: 12, color: '#6b7280' }}>Level {entry.level}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: isUser ? '#22c55e' : '#e8f5e9', fontFamily: 'Space Grotesk' }}>
                  {entry.xp} XP
                </div>
                {entry.streak > 0 && (
                  <div style={{ fontSize: 11, color: '#fbbf24' }}>🔥 {entry.streak}-day streak</div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Motivational note */}
      {userRank > 1 && (
        <div style={{
          marginTop: 24, padding: '16px 20px', borderRadius: 12,
          background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)',
          textAlign: 'center',
        }}>
          <p style={{ color: '#93c5fd', fontSize: 14 }}>
            🚀 You're #{userRank}. Take more quizzes and challenges to climb the ranks!
          </p>
        </div>
      )}
    </div>
  );
}
