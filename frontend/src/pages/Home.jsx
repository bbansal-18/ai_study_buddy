/**
 * src/components/Home.jsx
 *
 * Renders the home screen with primary navigation buttons for:
 * - Learn modules
 * - Practice problems
 * - Ask Questions (chat)
 *
 * Provides full-screen centered layout with prominent action buttons.
 *
 * Exports:
 *   - Home(): React component rendering landing page UI.
 *
 * @author bbansal-18
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Home component
 *
 * @returns {JSX.Element} Centered landing page with navigation buttons.
 */
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-4xl font-bold mb-12">AI Study Buddy</h1>
      <div className="flex gap-8">
        <button
          onClick={() => navigate('/learn')}
          className="bg-green-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-green-600 transition"
        >
          Learn
        </button>
        <button
          onClick={() => navigate('/practice')}
          className="bg-yellow-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-yellow-600 transition"
        >
          Practice
        </button>
        <button
          onClick={() => navigate('/chat')}
          className="bg-blue-500 text-white px-8 py-4 rounded-lg text-xl hover:bg-blue-600 transition"
        >
          Ask Questions
        </button>
      </div>
    </div>
  );
}
