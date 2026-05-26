import React, { useState, useEffect } from 'react';
import { useGame } from '../contexts/GameContext';
import { quizCategories, allBadges } from '../data/quizzes';

function QuizCard({ category, onStart, isCompleted }) {
  return (
    <div className="card card-hover" style={{ padding: '24px', cursor: 'pointer', transition: 'all 0.2s' }}
      onClick={() => onStart(category)}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: category.color + '20', border: `1px solid ${category.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26,
        }}>{category.icon}</div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span className={`badge badge-${category.difficulty === 'Easy' ? 'green' : category.difficulty === 'Hard' ? 'blue' : 'amber'}`}>
            {category.difficulty}
          </span>
          {isCompleted && <span style={{ fontSize: 11, color: '#22c55e' }}>✓ Completed</span>}
        </div>
      </div>
      <h3 style={{ fontSize: 16, color: '#e8f5e9', marginBottom: 6 }}>{category.title}</h3>
      <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>
        {category.questions.length} questions · Test your knowledge
      </p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: category.color }}>+{category.xp} XP</span>
        <button className="btn-primary" style={{ padding: '6px 14px', fontSize: 13, background: category.color + 'dd' }}>
          {isCompleted ? 'Retake →' : 'Start →'}
        </button>
      </div>
    </div>
  );
}

function QuizRunner({ category, onFinish }) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timedOut, setTimedOut] = useState(false);

  const q = category.questions[current];
  const isLast = current === category.questions.length - 1;

  useEffect(() => {
    if (answered || showResults) return;
    const t = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(t);
          setTimedOut(true);
          setAnswered(true);
          setAnswers(prev2 => [...prev2, { questionIndex: current, selected: null, correct: false }]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [current, answered, showResults]);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const correct = idx === q.correct;
    if (correct) setScore(s => s + 1);
    setAnswers(prev => [...prev, { questionIndex: current, selected: idx, correct }]);
  };

  const handleNext = () => {
    if (isLast) {
      setShowResults(true);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
      setAnswered(false);
      setTimeLeft(30);
      setTimedOut(false);
    }
  };

  if (showResults) {
    const pct = Math.round((score / category.questions.length) * 100);
    const xpEarned = Math.round(category.xp * (score / category.questions.length));
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 72, marginBottom: 16 }}>
          {pct === 100 ? '🌟' : pct >= 60 ? '🌿' : '🌱'}
        </div>
        <h2 style={{ fontSize: 28, color: '#e8f5e9', marginBottom: 8 }}>
          {pct === 100 ? 'Perfect Score!' : pct >= 60 ? 'Great Job!' : 'Keep Learning!'}
        </h2>
        <p style={{ color: '#6b7280', marginBottom: 28 }}>
          You answered {score} out of {category.questions.length} correctly
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 32 }}>
          {[
            { label: 'Score', value: `${pct}%`, color: pct >= 80 ? '#22c55e' : '#fbbf24' },
            { label: 'XP Earned', value: `+${xpEarned}`, color: '#a78bfa' },
            { label: 'Correct', value: `${score}/${category.questions.length}`, color: '#60a5fa' },
          ].map(s => (
            <div key={s.label} className="card" style={{ padding: 16 }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: 'Space Grotesk' }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ marginBottom: 28, textAlign: 'left' }}>
          {category.questions.map((q, i) => {
            const a = answers[i];
            return (
              <div key={i} className="card" style={{ padding: '14px 16px', marginBottom: 10 }}>
                <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 6 }}>Q{i+1}. {q.question}</div>
                <div style={{ fontSize: 13, color: a?.correct ? '#22c55e' : '#f87171' }}>
                  {a?.correct ? '✓' : '✗'} {a?.selected != null ? q.options[a.selected] : 'No answer (timed out)'}
                </div>
                {!a?.correct && (
                  <div style={{ fontSize: 12, color: '#4ade80', marginTop: 4 }}>
                    Correct: {q.options[q.correct]}
                  </div>
                )}
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 6, fontStyle: 'italic' }}>{q.explanation}</div>
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button className="btn-secondary" onClick={() => onFinish(score, xpEarned, pct === 100)}>
            ← Back to Quizzes
          </button>
          <button className="btn-primary" onClick={() => {
            setCurrent(0); setSelected(null); setAnswered(false);
            setScore(0); setAnswers([]); setShowResults(false); setTimeLeft(30);
          }}>
            Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24 }}>{category.icon}</span>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#e8f5e9' }}>{category.title}</div>
            <div style={{ fontSize: 12, color: '#6b7280' }}>Question {current + 1} of {category.questions.length}</div>
          </div>
        </div>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: timeLeft <= 10 ? 'rgba(248,113,113,0.15)' : 'rgba(34,197,94,0.1)',
          border: `2px solid ${timeLeft <= 10 ? '#f87171' : '#22c55e'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, fontWeight: 700, color: timeLeft <= 10 ? '#f87171' : '#22c55e',
          fontFamily: 'Space Grotesk',
          animation: timeLeft <= 5 ? 'pulse-green 1s infinite' : 'none',
        }}>{timeLeft}</div>
      </div>

      {/* Progress Bar */}
      <div className="xp-bar-track" style={{ marginBottom: 28, height: 6 }}>
        <div className="xp-bar-fill" style={{ width: `${((current) / category.questions.length) * 100}%` }} />
      </div>

      {/* Question */}
      <div className="card" style={{ padding: '24px', marginBottom: 20 }}>
        <p style={{ fontSize: 18, color: '#e8f5e9', lineHeight: 1.6 }}>{q.question}</p>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
        {q.options.map((opt, idx) => {
          let borderColor = 'rgba(255,255,255,0.08)';
          let bg = 'rgba(255,255,255,0.04)';
          let color = '#e8f5e9';
          if (answered) {
            if (idx === q.correct) { bg = 'rgba(34,197,94,0.15)'; borderColor = '#22c55e80'; color = '#4ade80'; }
            else if (idx === selected) { bg = 'rgba(248,113,113,0.15)'; borderColor = '#f8717180'; color = '#fca5a5'; }
          } else if (selected === idx) {
            bg = 'rgba(34,197,94,0.1)'; borderColor = 'rgba(34,197,94,0.4)';
          }
          return (
            <button key={idx} onClick={() => handleSelect(idx)} style={{
              background: bg, border: `1px solid ${borderColor}`,
              borderRadius: 12, padding: '14px 18px', textAlign: 'left',
              color, fontSize: 15, transition: 'all 0.15s', cursor: answered ? 'default' : 'pointer',
            }}>
              <span style={{ marginRight: 10, opacity: 0.5 }}>{String.fromCharCode(65+idx)}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {answered && (
        <div style={{
          background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
          borderRadius: 12, padding: '14px 16px', marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, color: '#9ca3af', marginBottom: 4 }}>💡 Explanation</div>
          <p style={{ fontSize: 14, color: '#d1fae5', lineHeight: 1.6 }}>{q.explanation}</p>
        </div>
      )}

      {answered && (
        <button className="btn-primary" onClick={handleNext} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
          {isLast ? '🏁 See Results' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

export default function Quiz() {
  const { state, dispatch } = useGame();
  const [activeQuiz, setActiveQuiz] = useState(null);

  const handleStart = (category) => setActiveQuiz(category);

  const handleFinish = (score, xpEarned, perfect) => {
    dispatch({ type: 'ADD_XP', payload: xpEarned });
    dispatch({ type: 'COMPLETE_QUIZ', payload: { id: activeQuiz.id, score, total: activeQuiz.questions.length, correct: score, xp: xpEarned } });

    const completed = state.completedQuizzes.length + 1;
    if (completed === 1) dispatch({ type: 'EARN_BADGE', payload: allBadges.find(b => b.id === 'first_quiz') });
    if (completed >= 5) dispatch({ type: 'EARN_BADGE', payload: allBadges.find(b => b.id === 'quiz_master') });
    if (perfect) dispatch({ type: 'EARN_BADGE', payload: allBadges.find(b => b.id === 'perfect_score') });
    if (activeQuiz.id === 'climate' && perfect) dispatch({ type: 'EARN_BADGE', payload: allBadges.find(b => b.id === 'climate_ace') });
    if (activeQuiz.id === 'water') dispatch({ type: 'EARN_BADGE', payload: allBadges.find(b => b.id === 'water_hero') });
    const totalXp = state.user.xp + xpEarned;
    if (totalXp >= 500) dispatch({ type: 'EARN_BADGE', payload: allBadges.find(b => b.id === 'xp_500') });
    if (totalXp >= 1000) dispatch({ type: 'EARN_BADGE', payload: allBadges.find(b => b.id === 'xp_1000') });

    dispatch({ type: 'UPDATE_STREAK', payload: state.user.streak + 1 });
    if (state.user.streak + 1 >= 7) dispatch({ type: 'EARN_BADGE', payload: allBadges.find(b => b.id === 'streak_7') });

    setActiveQuiz(null);
  };

  if (activeQuiz) {
    return (
      <div>
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <button onClick={() => setActiveQuiz(null)} className="btn-secondary" style={{ padding: '7px 14px' }}>
            ← Exit Quiz
          </button>
        </div>
        <QuizRunner category={activeQuiz} onFinish={handleFinish} />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, color: '#e8f5e9', marginBottom: 8 }}>🎯 Eco Quizzes</h1>
        <p style={{ color: '#6b7280' }}>Test your environmental knowledge and earn XP. Each quiz has a 30-second timer per question!</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
        {quizCategories.map(cat => (
          <QuizCard
            key={cat.id}
            category={cat}
            onStart={handleStart}
            isCompleted={state.completedQuizzes.some(q => q.id === cat.id)}
          />
        ))}
      </div>
    </div>
  );
}
