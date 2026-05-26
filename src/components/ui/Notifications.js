import React, { useEffect } from 'react';
import { useGame } from '../../contexts/GameContext';

export default function Notifications() {
  const { state, dispatch } = useGame();

  useEffect(() => {
    if (state.notifications.length === 0) return;
    const timer = setTimeout(() => {
      dispatch({ type: 'DISMISS_NOTIFICATION', payload: state.notifications[0].id });
    }, 3500);
    return () => clearTimeout(timer);
  }, [state.notifications, dispatch]);

  if (state.notifications.length === 0) return null;

  const n = state.notifications[0];
  return (
    <div style={{
      position: 'fixed', top: 80, right: 20, zIndex: 1000,
      background: 'rgba(20,40,25,0.97)',
      border: '1px solid rgba(34,197,94,0.4)',
      borderRadius: 14,
      padding: '14px 20px',
      display: 'flex', alignItems: 'center', gap: 12,
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: 'fadeInUp 0.3s ease',
      maxWidth: 320,
      backdropFilter: 'blur(16px)',
    }}>
      <span style={{ fontSize: 24 }}>{n.type === 'levelup' ? '🎉' : '🏅'}</span>
      <span style={{ fontSize: 14, fontWeight: 500, color: '#e8f5e9' }}>{n.msg}</span>
      <button
        onClick={() => dispatch({ type: 'DISMISS_NOTIFICATION', payload: n.id })}
        style={{ background: 'none', color: '#6b7280', fontSize: 16, marginLeft: 4, flexShrink: 0 }}
      >✕</button>
    </div>
  );
}
