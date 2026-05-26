import React, { createContext, useContext, useReducer, useEffect } from 'react';

const GameContext = createContext();

const initialState = {
  user: {
    name: 'Eco Explorer',
    avatar: '🌿',
    level: 1,
    xp: 0,
    xpToNext: 200,
    streak: 0,
    lastActive: null,
  },
  badges: [],
  completedQuizzes: [],
  completedChallenges: [],
  leaderboard: [
    { id: 1, name: 'Arjun Sharma', xp: 4200, level: 12, avatar: '🦋', streak: 15 },
    { id: 2, name: 'Priya Nair', xp: 3800, level: 11, avatar: '🌸', streak: 22 },
    { id: 3, name: 'Rohit Kumar', xp: 3500, level: 10, avatar: '🌊', streak: 8 },
    { id: 4, name: 'Divya Menon', xp: 2900, level: 9, avatar: '🌻', streak: 12 },
    { id: 5, name: 'Aditya Rao', xp: 2700, level: 8, avatar: '🦜', streak: 5 },
    { id: 6, name: 'Sneha Pillai', xp: 2400, level: 7, avatar: '🌺', streak: 18 },
    { id: 7, name: 'You', xp: 0, level: 1, avatar: '🌿', streak: 0, isUser: true },
  ],
  totalQuestions: 0,
  correctAnswers: 0,
  notifications: [],
};

function calcLevel(xp) { return Math.floor(Math.sqrt(xp / 100)) + 1; }
function xpForLevel(level) { return Math.pow(level - 1, 2) * 100; }

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_XP': {
      const newXp = state.user.xp + action.payload;
      const newLevel = calcLevel(newXp);
      const leveledUp = newLevel > state.user.level;
      const updatedLeaderboard = state.leaderboard
        .map(e => e.isUser ? { ...e, xp: newXp, level: newLevel } : e)
        .sort((a, b) => b.xp - a.xp);
      return {
        ...state,
        user: { ...state.user, xp: newXp, level: newLevel, xpToNext: xpForLevel(newLevel + 1) },
        leaderboard: updatedLeaderboard,
        notifications: leveledUp
          ? [...state.notifications, { id: Date.now(), type: 'levelup', msg: `🎉 Level Up! You're now Level ${newLevel}!` }]
          : state.notifications,
      };
    }
    case 'UPDATE_NAME':
      return {
        ...state,
        user: { ...state.user, name: action.payload },
        leaderboard: state.leaderboard.map(e => e.isUser ? { ...e, name: action.payload } : e),
      };
    case 'COMPLETE_QUIZ':
      return {
        ...state,
        completedQuizzes: [...state.completedQuizzes, action.payload],
        totalQuestions: state.totalQuestions + action.payload.total,
        correctAnswers: state.correctAnswers + action.payload.correct,
      };
    case 'EARN_BADGE':
      if (state.badges.find(b => b.id === action.payload.id)) return state;
      return {
        ...state,
        badges: [...state.badges, action.payload],
        notifications: [...state.notifications, { id: Date.now(), type: 'badge', msg: `🏅 Badge Earned: ${action.payload.name}!` }],
      };
    case 'COMPLETE_CHALLENGE':
      return { ...state, completedChallenges: [...state.completedChallenges, action.payload] };
    case 'UPDATE_STREAK':
      return {
        ...state,
        user: { ...state.user, streak: action.payload, lastActive: new Date().toISOString() },
        leaderboard: state.leaderboard.map(e => e.isUser ? { ...e, streak: action.payload } : e),
      };
    case 'DISMISS_NOTIFICATION':
      return { ...state, notifications: state.notifications.filter(n => n.id !== action.payload) };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = localStorage.getItem('ecospark_state');
    if (saved) {
      try { dispatch({ type: 'LOAD_STATE', payload: JSON.parse(saved) }); } catch(e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('ecospark_state', JSON.stringify(state));
  }, [state]);

  return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
}

export const useGame = () => useContext(GameContext);
