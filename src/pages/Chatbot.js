import React, { useState, useRef, useEffect } from 'react';

const SYSTEM_PROMPT = `You are EcoBot, a friendly and knowledgeable environmental education assistant for EcoSpark — a gamified platform for students in India to learn about the environment. 

Your personality:
- Enthusiastic and encouraging
- Use relevant emojis naturally
- Keep responses concise (2-4 paragraphs max)
- Relate examples to India when relevant (Indian geography, cities, rivers, policies like NAPCC, etc.)
- Encourage users to take quizzes and challenges on the platform
- Share surprising facts to spark curiosity
- Never be preachy; be conversational and fun

Your knowledge areas:
- Climate change and global warming
- Biodiversity and ecosystems  
- Water conservation
- Renewable energy (especially India's solar/wind progress)
- Waste management and recycling
- Sustainable living tips
- Environmental policies (Paris Agreement, India's NDCs, etc.)
- Local environmental issues (air quality, Ganga pollution, Western Ghats, etc.)

Always end with a question or suggestion to keep the conversation going.`;

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there! 🌿 I'm **EcoBot**, your AI environmental guide on EcoSpark!\n\nI can answer questions about climate change, biodiversity, water, energy, waste — anything eco-related. I'll also share fascinating facts and help you understand environmental issues specific to India.\n\nWhat would you like to explore today? 🌍",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setLoading(true);

    try {
      const apiMessages = newMessages.map(m => ({ role: m.role, content: m.content }));
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't get a response. Please try again!";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Oops! I'm having trouble connecting right now 🌐. Make sure you have internet access and try again in a moment!",
      }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    "What causes the urban heat island effect in Indian cities? 🌆",
    "How does India's solar energy compare globally? ☀️",
    "Why is the Western Ghats so important for biodiversity? 🌿",
    "What simple actions can I take to reduce my carbon footprint? 🌍",
    "Tell me a surprising environmental fact! 🤯",
  ];

  const renderMessage = (content) => {
    return content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br/>');
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)' }}>
      {/* Header */}
      <div className="card" style={{ padding: '16px 20px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(34,197,94,0.3), rgba(20,184,166,0.3))',
          border: '2px solid rgba(34,197,94,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
          animation: 'pulse-green 3s infinite',
        }}>🤖</div>
        <div>
          <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 17, color: '#e8f5e9' }}>EcoBot</div>
          <div style={{ fontSize: 12, color: '#22c55e' }}>● Online · Powered by Claude AI</div>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span className="badge badge-green">AI-Powered</span>
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14,
        paddingBottom: 8,
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            animation: 'fadeInUp 0.3s ease',
          }}>
            {msg.role === 'assistant' && (
              <div style={{
                width: 32, height: 32, borderRadius: '50%', flexShrink: 0, marginRight: 10, marginTop: 4,
                background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(20,184,166,0.2))',
                border: '1px solid rgba(34,197,94,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
              }}>🌿</div>
            )}
            <div style={{
              maxWidth: '75%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user'
                ? 'linear-gradient(135deg, rgba(34,197,94,0.25), rgba(20,184,166,0.2))'
                : 'rgba(255,255,255,0.05)',
              border: `1px solid ${msg.role === 'user' ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
              fontSize: 14, color: '#e8f5e9', lineHeight: 1.7,
            }}
              dangerouslySetInnerHTML={{ __html: renderMessage(msg.content) }}
            />
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(34,197,94,0.2), rgba(20,184,166,0.2))',
              border: '1px solid rgba(34,197,94,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
            }}>🌿</div>
            <div className="card" style={{ padding: '12px 16px' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: '#22c55e',
                    animation: `pulse-green 1.2s ease ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 8 }}>💡 Try asking:</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {suggestions.map((s, i) => (
              <button key={i} onClick={() => { setInput(s); }}
                style={{
                  padding: '6px 12px', borderRadius: 100, fontSize: 12, fontWeight: 500,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                  color: '#9ca3af', cursor: 'pointer', transition: 'all 0.15s',
                  textAlign: 'left',
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
          placeholder="Ask EcoBot anything about the environment..."
          style={{
            flex: 1, background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12,
            padding: '12px 16px', color: '#e8f5e9', fontSize: 14,
          }}
        />
        <button onClick={sendMessage} disabled={loading || !input.trim()} className="btn-primary"
          style={{ padding: '12px 20px', opacity: loading || !input.trim() ? 0.5 : 1 }}>
          {loading ? '⏳' : '→'}
        </button>
      </div>
    </div>
  );
}
