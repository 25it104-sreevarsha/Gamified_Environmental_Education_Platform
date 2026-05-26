# 🌿 EcoSpark — Gamified Environmental Education Platform
> SIH Problem Statement: SIH25009 | Theme: Smart Education

## Features Built
- 🎯 Quizzes — 5 categories, 30s timer per question, XP rewards
- ⚡ Challenges — 10 real-world eco challenges with impact info
- 🏆 Leaderboard — Ranked with podium UI and streak display
- 🤖 EcoBot AI — Claude-powered chatbot with India-specific knowledge
- 🏅 Badges — 10 unlockable achievement badges
- 📊 Dashboard — Radar chart, XP progress, weekly stats
- 👤 Profile — Customizable avatar, activity log, badge showcase
- 🔥 Streaks — Daily learning streak tracking
- 💾 Persistence — localStorage saves all progress

## Tech Stack
- Frontend: React 18, React Router v6, Recharts
- State: React Context + useReducer
- Storage: localStorage (upgrade to Firebase for multi-user)
- AI: Anthropic Claude API (claude-sonnet-4)
- Deploy: Vercel / Netlify / Firebase Hosting

## Quick Start
```bash
npm install
npm start       # Dev server at localhost:3000
npm run build   # Production build
```

## Deploy to Vercel (Free)
```bash
npm install -g vercel
vercel          # Follow prompts
```

## Deploy to Netlify (Free)
```bash
npm run build
# Drag & drop the /build folder at netlify.com/drop
# OR: npm install -g netlify-cli && netlify deploy --prod --dir=build
```

## Add Firebase (Multi-user + Cloud DB)
1. Create project at console.firebase.google.com
2. npm install firebase
3. Create src/firebase.js with your config
4. Replace localStorage in GameContext.js with Firestore calls
5. Add Google Auth for login

## Project Structure
```
src/
  contexts/GameContext.js    - Global XP, badges, state
  data/quizzes.js            - 5 quiz categories x 5 questions
  data/challenges.js         - 10 eco challenges
  pages/Dashboard.js         - Home with charts
  pages/Quiz.js              - Quiz runner with timer
  pages/Challenges.js        - Challenge cards
  pages/Leaderboard.js       - Rankings
  pages/Chatbot.js           - AI EcoBot
  pages/Profile.js           - User profile
  components/layout/Navbar.js
  components/ui/Notifications.js
```

## SIH Highlights
- Gamification increases learning engagement by 40%+
- AI chatbot gives personalized, always-on guidance
- Challenges bridge digital learning to real-world action
- Scalable: Firebase supports entire school networks
