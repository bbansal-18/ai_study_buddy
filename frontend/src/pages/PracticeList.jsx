/**
 * src/pages/PracticeList.jsx
 *
 * Renders a searchable list of practice problems fetched from the backend.
 * - Fetches all problems on mount.
 * - Filters problems by topic based on user input.
 * - Navigates to problem detail on selection.
 *
 * Exports:
 *   - PracticeList(): React component
 *
 * @author bbansal-18
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Fetch the list of practice problems from the API.
 *
 * @returns {Promise<Array<Object>>} Resolves to array of problem objects
 */
async function fetchProblems() {
  const response = await fetch('http://localhost:5050/practice/problems');
  if (!response.ok) throw new Error('Failed to fetch problems');
  return response.json();
}

/**
 * Filter problems by topic substring (case-insensitive).
 *
 * @param {Array<Object>} problems - Full list of problem objects
 * @param {string} query - Topic filter string
 * @returns {Array<Object>} Filtered list of problems
 */
function filterByTopic(problems, query) {
  const lower = query.toLowerCase();
  return problems.filter(p => p.topic.toLowerCase().includes(lower));
}

/**
 * PracticeList component
 *
 * Displays a search input and a scrollable list of problems.
 * Handles fetching, filtering, and navigation.
 *
 * @returns {JSX.Element} Searchable list UI
 */
export default function PracticeList() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProblems()
      .then(setProblems)
      .catch(err => console.error(err));
  }, []);

  const filteredProblems = filterByTopic(problems, search);

  return (
    <div className="h-full flex flex-col p-6">
      <input
        type="text"
        placeholder="Search by topic…"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {filteredProblems.length > 0 ? (
          filteredProblems.map(p => (
            <div
              key={p.id}
              onClick={() => navigate(`/practice/${p.id}`)}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase text-gray-500">{p.topic}</span>
                <span className={
                  p.difficulty === 'easy'
                    ? 'text-green-600 font-semibold'
                    : p.difficulty === 'moderate'
                    ? 'text-yellow-600 font-semibold'
                    : 'text-red-600 font-semibold'
                }>
                  {p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1)}
                </span>
              </div>
              <h2 className="mt-2 text-lg font-bold">{p.title}</h2>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No problems match that topic.</p>
        )}
      </div>

      <div className="mt-6 space-y-1 text-gray-500 text-sm">
        <p>
          <span className="text-green-600 font-medium">Easy</span> — for beginners with basic syntax and concepts.
        </p>
        <p>
          <span className="text-yellow-600 font-medium">Moderate</span> — 1+ month of practice, comfortable with problem-solving patterns.
        </p>
        <p>
          <span className="text-red-600 font-medium">Hard</span> — 1+ year of experience, advanced algorithmic challenges.
        </p>
      </div>
    </div>
  );
}
