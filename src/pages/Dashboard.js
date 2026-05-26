import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { allBadges } from '../data/quizzes';

export default function Dashboard() {
  const { state } = useGame();
  const { user, completedQuizzes, completedChallenges, badges } = state;
  const accuracy = state.totalQuestions > 0 ? Math.round((state.correctAnswers / state.totalQuestions) * 100) : 0;
  const xpPercent = Math.min(100, Math.round((user.xp / user.xpToNext) * 100));

  const radarData = [
    { subject: 'Climate', A: completedQuizzes.filter(q => q.id === 'climate').length * 100 },
    { subject: 'Biodiversity', A: completedQuizzes.filter(q => q.id === 'biodiversity').length * 100 },
    { subject: 'Water', A: completedQuizzes.filter(q => q.id === 'water').length * 100 },
    { subject: 'Energy', A: completedQuizzes.filter(q => q.id === 'renewables').length * 100 },
    { subject: 'Waste', A: completedQuizzes.filter(q => q.id === 'waste').length * 100 },
  ];

  const weeklyData = [
    { day: 'Mon', xp: 0 }, { day: 'Tue', xp: 0 }, { day: 'Wed', xp: 0 },
    { day: 'Thu', xp: 0 }, { day: 'Fri', xp: 0 }, { day: 'Sat', xp: 0 }, { day: 'Sun', xp: user.xp },
  ];

  const quickActions = [
    { label: 'Take a Quiz', icon: '🎯', path: '/quiz', color: '#22c55e' },
    { label: 'Eco Challenge', icon: '⚡', path: '/challenges', color: '#fbbf24' },
    { label: 'Leaderboard', icon: '🏆', path: '/leaderboard', color: '#a78bfa' },
    { label: 'Ask EcoBot', icon: '🤖', path: '/chat', color: '#60a5fa' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34,197,94,0.15) 0%, rgba(20,184,166,0.1) 100%)',
        border: '1px solid rgba(34,197,94,0.2)',
        borderRadius: 20, padding: '28px 32px', marginBottom: 28,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', right: -20, top: -20, fontSize: 120, opacity: 0.06 }}>🌍</div>
        <div>
          <div style={{ fontSize: 14, color: '#4ade80', marginBottom: 6, fontWeight: 500 }}>
            {user.streak > 0 ? `🔥 ${user.streak}-day streak!` : '🌱 Start your eco journey'}
          </div>
          <h1 style={{ fontSize: 28, color: '#e8f5e9', marginBottom: 4 }}>
            Welcome back, {user.name}!
          </h1>
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            {completedQuizzes.length === 0
              ? 'Take your first quiz to start earning XP and badges.'
              : `You've completed ${completedQuizzes.length} quiz${completedQuizzes.length > 1 ? 'zes' : ''} and ${completedChallenges.length} challenge${completedChallenges.length !== 1 ? 's' : ''}.`}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 4 }}>Level</div>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontWeight: 700, color: 'white',
              fontFamily: 'Space Grotesk',
            }}>{user.level}</div>
          </div>
          <div style={{ minWidth: 140 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, color: '#9ca3af' }}>{user.xp} XP</span>
              <span style={{ fontSize: 13, color: '#9ca3af' }}>{user.xpToNext} XP</span>
            </div>
            <div className="xp-bar-track" style={{ height: 10 }}>
              <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
            </div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4, textAlign: 'center' }}>
              {user.xpToNext - user.xp} XP to Level {user.level + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total XP', value: user.xp, icon: '⚡', color: '#22c55e' },
          { label: 'Quizzes Done', value: completedQuizzes.length, icon: '🎯', color: '#fbbf24' },
          { label: 'Challenges', value: completedChallenges.length, icon: '🏆', color: '#a78bfa' },
          { label: 'Accuracy', value: `${accuracy}%`, icon: '🎲', color: '#60a5fa' },
          { label: 'Badges', value: badges.length, icon: '🏅', color: '#f87171' },
          { label: 'Streak', value: `${user.streak}d`, icon: '🔥', color: '#fbbf24' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '16px', textAlign: 'center' }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>{stat.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: stat.color, fontFamily: 'Space Grotesk' }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 18, color: '#e8f5e9', marginBottom: 14 }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
          {quickActions.map(a => (
            <Link key={a.path} to={a.path} style={{ textDecoration: 'none' }}>
              <div className="card card-hover" style={{
                padding: '20px 16px', textAlign: 'center', cursor: 'pointer',
                transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>{a.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: a.color }}>{a.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: 15, color: '#e8f5e9', marginBottom: 16 }}>📊 Knowledge Radar</h3>
          <ResponsiveContainer width="100%" height={200}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
              <Radar dataKey="A" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: 15, color: '#e8f5e9', marginBottom: 16 }}>📈 Weekly XP</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1a2e1d', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: '#e8f5e9' }} />
              <Bar dataKey="xp" fill="#22c55e" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges */}
      <div className="card" style={{ padding: '24px', marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h2 style={{ fontSize: 18, color: '#e8f5e9' }}>🏅 Badges</h2>
          <span style={{ fontSize: 13, color: '#6b7280' }}>{badges.length} / {allBadges.length}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 12 }}>
          {allBadges.map(b => {
            const earned = badges.find(e => e.id === b.id);
            return (
              <div key={b.id} style={{
                padding: '14px 10px', borderRadius: 12, textAlign: 'center',
                background: earned ? `rgba(${b.color.replace('#','').match(/.{2}/g).map(x=>parseInt(x,16)).join(',')},0.1)` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${earned ? b.color + '40' : 'rgba(255,255,255,0.06)'}`,
                opacity: earned ? 1 : 0.4,
                transition: 'all 0.2s',
              }}>
                <div style={{ fontSize: 28, marginBottom: 6, filter: earned ? 'none' : 'grayscale(1)' }}>{b.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: earned ? b.color : '#6b7280', lineHeight: 1.3 }}>{b.name}</div>
                <div style={{ fontSize: 10, color: '#6b7280', marginTop: 3 }}>{b.desc}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
