import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';
import { formatChatResponse } from './formatChatResponse';

const STORAGE_KEY = 'chat-history';

export default function ChatBox() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]); // { type, content, ts }
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  // 1) Load & prune history, then inject greeting if empty
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    const cutoff = Date.now() - 24 * 60 * 60 * 1000;
    let fresh = [];
    if (raw) {
      fresh = JSON.parse(raw).filter(msg => msg.ts > cutoff);
    }
    // if no messages remain, add the AI greeting
    if (fresh.length === 0) {
      fresh = [{
        type: 'ai',
        content: 'I am your AI assistant. Ask me anything!',
        ts: Date.now()
      }];
    }
    setHistory(fresh);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
  }, []);

  // 2) Persist and auto-scroll
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!query.trim()) return;

    // add user message
    const userMsg = { type: 'user', content: query.trim(), ts: Date.now() };
    setHistory(h => [...h, userMsg]);
    setQuery('');
    setIsTyping(true);

    // wrapper to call /chat once
    const callChat = () =>
      fetch('http://localhost:5050/chat', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ query: userMsg.content })
      });

    try {
      // first attempt
      let chatRes = await callChat();
      if (!chatRes.ok) {
        // retry once
        chatRes = await callChat();
      }

      if (!chatRes.ok) {
        // still bad → server busy
        throw new Error('Server is busy. Try again later.');
      }

      const data = await chatRes.json();
      const aiText = data.valid
        // ? data.answer
        ? data.answer
        : 'Sorry, I cannot assist you with that one.';

      setHistory(h => [
        ...h,
        { type: 'ai', content: aiText, ts: Date.now() }
      ]);
    } catch (err) {
      // on network or server error (including our thrown “server busy”)
      setHistory(h => [
        ...h,
        { type: 'ai', content: err.message, ts: Date.now() }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // 3) Clear chat handler
  const handleClearChat = () => {
    if (window.confirm("Are you sure you want to clear the entire chat history?")) {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([{
        type: 'ai',
        content: 'I am your AI assistant. Ask me anything!',
        ts: Date.now()
      }]);
    }
  };

  return (
    <div className="chat-card">
      <header className="chat-header">
        <h2>AI Study Buddy</h2>
      </header>

      <div className="chat-body">
        {history.map((msg, i) => (
          <div key={msg.ts + '-' + i}
               className={`chat-bubble ${msg.type}-bubble`}>
            {msg.type === 'ai'
              ? formatChatResponse(msg.content)
              : <p className="user-text">{msg.content}</p>}
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble ai-bubble typing">
            <span className="dot"></span><span className="dot"></span><span className="dot"></span>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      <form onSubmit={handleSubmit} className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask me anything…"
          disabled={isTyping}
        />
        <button
          type="submit"
          disabled={isTyping || !query.trim()}
          className="send-button"
        >
          {/* simple arrow icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="icon-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6l6 6m0 0l-6 6m6-6H4"/>
          </svg>
        </button>
      </form>

      <footer className="chat-footer">
        <p className="note">
          Chat history is kept for 24 hours and will disappear when you close the tab if you’re not logged in.
        </p>
        <button onClick={handleClearChat} className="clear-button">
          Clear Chat
        </button>
      </footer>
    </div>
  );
}
