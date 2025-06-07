// src/pages/PracticeList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


export default function PracticeList() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();


  // 1. Fetch problem list on mount
  useEffect(() => {
    fetch('http://localhost:5050/practice/problems')
      .then((res) => res.json())
      .then(setProblems)
      .catch(console.error);
  }, []);

  // 2. Filter by topic (case-insensitive substring match)
  const filtered = problems.filter((p) =>
    p.topic.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col p-6">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by topic…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Scrollable List */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {filtered.length > 0 ? (
          filtered.map((p) => (
            <div
              key={p.id}
              onClick={() => navigate(`/practice/${p.id}`)}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase text-gray-500">{p.topic}</span>
                <span
                  className={
                    p.difficulty === 'easy'
                      ? 'text-green-600 font-semibold'
                      : p.difficulty === 'moderate'
                      ? 'text-yellow-600 font-semibold'
                      : 'text-red-600 font-semibold'
                  }
                >
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

      {/* Difficulty Legend */}
      <div className="mt-6 space-y-1 text-gray-500 text-sm">
        <p>
          <span className="text-green-600 font-medium">Easy</span> —  
          for beginners with basic syntax and concepts.
        </p>
        <p>
          <span className="text-yellow-600 font-medium">Moderate</span> —  
          1+ month of practice, comfortable with problem-solving patterns.
        </p>
        <p>
          <span className="text-red-600 font-medium">Hard</span> —  
          1+ year of experience, advanced algorithmic challenges.
        </p>
      </div>
    </div>
  );
}
