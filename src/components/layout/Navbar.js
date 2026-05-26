import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useGame } from '../../contexts/GameContext';

const navItems = [
  { path: '/', label: 'Dashboard', icon: '🏠' },
  { path: '/quiz', label: 'Quizzes', icon: '🎯' },
  { path: '/challenges', label: 'Challenges', icon: '⚡' },
  { path: '/leaderboard', label: 'Leaders', icon: '🏆' },
  { path: '/chat', label: 'EcoBot', icon: '🤖' },
];

export default function Navbar() {
  const { state } = useGame();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const xpPercent = Math.min(100, Math.round((state.user.xp / state.user.xpToNext) * 100));

  return (
    <>
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(15, 26, 18, 0.9)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        padding: '0 24px',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', height: 64, gap: 24 }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #22c55e, #14b8a6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>🌿</div>
            <span style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 18, color: '#e8f5e9' }}>
              Eco<span style={{ color: '#22c55e' }}>Spark</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', gap: 4, flex: 1, justifyContent: 'center' }} className="desktop-nav">
            {navItems.map(item => (
              <Link key={item.path} to={item.path} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 10,
                fontSize: 14, fontWeight: 500,
                color: location.pathname === item.path ? '#22c55e' : '#9ca3af',
                background: location.pathname === item.path ? 'rgba(34,197,94,0.1)' : 'transparent',
                transition: 'all 0.15s',
                textDecoration: 'none',
              }}>
                <span>{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* User Info */}
          <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0, textDecoration: 'none' }}>
            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontSize: 12, color: '#9ca3af', lineHeight: 1 }}>
                Lv.{state.user.level} · {state.user.xp} XP
              </div>
              <div style={{ width: 80, height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ width: `${xpPercent}%`, height: '100%', background: 'linear-gradient(90deg,#22c55e,#14b8a6)', borderRadius: 2 }} />
              </div>
            </div>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'rgba(34,197,94,0.15)',
              border: '2px solid rgba(34,197,94,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              {state.user.avatar}
            </div>
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="mobile-menu-btn"
            style={{ background: 'none', color: '#9ca3af', fontSize: 22, padding: 4 }}
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', inset: 0, top: 64, zIndex: 99,
          background: 'rgba(15,26,18,0.97)', backdropFilter: 'blur(16px)',
          padding: 24, display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '14px 16px', borderRadius: 12,
                fontSize: 16, fontWeight: 500,
                color: location.pathname === item.path ? '#22c55e' : '#e8f5e9',
                background: location.pathname === item.path ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)',
                textDecoration: 'none',
              }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .desktop-nav { display: flex !important; }
        .mobile-menu-btn { display: none !important; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  );
}
