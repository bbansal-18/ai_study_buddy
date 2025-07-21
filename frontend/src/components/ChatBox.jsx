/**
 * src/components/ChatBox.jsx
 *
 * ChatBox component manages user-AI interaction UI:
 * - Loads, prunes, and saves chat history to localStorage (24h retention).
 * - Handles user input submission and AI responses via /chat API.
 * - Provides clear chat functionality with confirmation.
 *
 * Exports:
 *   - ChatBox(): React component rendering the chat UI.
 *
 * @author bbansal-18
 */

import React, { useState, useEffect, useRef } from 'react';
import './ChatBox.css';
import { formatChatResponse } from './formatChatResponse';

// Key for localStorage history
const STORAGE_KEY = 'chat-history';

/**
 * Load and prune chat history from localStorage.
 * Removes entries older than 24 hours, injects AI greeting if empty.
 *
 * @returns {Array<Object>} Array of message objects {type, content, ts (timestamp)}.
 */
function loadInitialHistory() {
  const raw = localStorage.getItem(STORAGE_KEY);
  const cutoff = Date.now() - 24 * 60 * 60 * 1000;
  let history = [];
  if (raw) {
    history = JSON.parse(raw).filter(msg => msg.ts > cutoff);
  }
  if (history.length === 0) {
    history = [{ type: 'ai', content: 'I am your AI assistant. Ask me anything!', ts: Date.now() }];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  return history;
}

/**
 * Persist chat history to localStorage and scroll to bottom.
 *
 * @param {Array<Object>} history List of message objects.
 * @param {React.RefObject} scrollRef Ref to dummy div for scrollIntoView().
 */
function saveAndScroll(history, scrollRef) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Send user query to AI backend, retrying once on failure.
 *
 * @param {string} userQuery Text query from user.
 * @returns {Promise<string>} AI response text or throws error.
 */
async function fetchAIResponse(userQuery) {
  const payload = { query: userQuery };
  const options = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) };
  const endpoint = 'http://localhost:5050/chat';

  let response = await fetch(endpoint, options);
  if (!response.ok) {
    response = await fetch(endpoint, options);
  }
  if (!response.ok) {
    throw new Error('Server is busy. Try again later.');
  }
  const data = await response.json();
  return data.valid ? data.answer : 'Sorry, I cannot assist you with that one.';
}

/**
 * ChatBox component: renders chat interface with history, input, and footer.
 * Manages state for query, history, and typing indicator.
 */
export default function ChatBox() {
  const [query, setQuery] = useState('');
  const [history, setHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef();

  // Load initial history on mount
  useEffect(() => {
    setHistory(loadInitialHistory());
  }, []);

  // Persist history and auto-scroll on update
  useEffect(() => {
    saveAndScroll(history, scrollRef);
  }, [history]);

  /**
   * Handle form submission: update history with user msg, fetch AI reply.
   * @param {React.FormEvent} e Submit event.
   */
  const handleSubmit = async e => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const userMsg = { type: 'user', content: trimmed, ts: Date.now() };
    setHistory(h => [...h, userMsg]);
    setQuery('');
    setIsTyping(true);

    try {
      const aiText = await fetchAIResponse(trimmed);
      setHistory(h => [...h, { type: 'ai', content: aiText, ts: Date.now() }]);
    } catch (err) {
      setHistory(h => [...h, { type: 'ai', content: err.message, ts: Date.now() }]);
    } finally {
      setIsTyping(false);
    }
  };

  /**
   * Clear chat history after confirmation, resetting to initial greeting.
   */
  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the entire chat history?')) {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([{ type: 'ai', content: 'I am your AI assistant. Ask me anything!', ts: Date.now() }]);
    }
  };

  return (
    <div className="chat-card">
      <header className="chat-header">
        <h2>AI Study Buddy</h2>
      </header>

      <div className="chat-body">
        {history.map((msg, i) => (
          <div key={`${msg.ts}-${i}`} className={`chat-bubble ${msg.type}-bubble`}>
            {msg.type === 'ai'
              ? formatChatResponse(msg.content)
              : <p className="user-text">{msg.content}</p>}
          </div>
        ))}

        {isTyping && (
          <div className="chat-bubble ai-bubble typing">
            <span className="dot" /><span className="dot" /><span className="dot" />
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
        <button type="submit" disabled={isTyping || !query.trim()} className="send-button">
          <svg xmlns="http://www.w3.org/2000/svg" className="icon-arrow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6l6 6m0 0l-6 6m6-6H4" />
          </svg>
        </button>
      </form>

      <footer className="chat-footer">
        <p className="note">Chat history is kept for 24 hours and will disappear when you close the tab if you’re not logged in.</p>
        <button onClick={handleClearChat} className="clear-button">Clear Chat</button>
      </footer>
    </div>
  );
}
