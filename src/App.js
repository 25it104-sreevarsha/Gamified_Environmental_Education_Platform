import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './contexts/GameContext';
import Navbar from './components/layout/Navbar';
import Notifications from './components/ui/Notifications';
import Dashboard from './pages/Dashboard';
import Quiz from './pages/Quiz';
import Challenges from './pages/Challenges';
import Leaderboard from './pages/Leaderboard';
import Chatbot from './pages/Chatbot';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <div className="app-bg" style={{ minHeight: '100vh' }}>
          <Navbar />
          <Notifications />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/challenges" element={<Challenges />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
