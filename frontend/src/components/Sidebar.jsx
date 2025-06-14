// src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/',        label: 'Home',          color: 'hover:bg-gray-200' },
  { to: '/learn',   label: 'Modules',       color: 'hover:bg-green-200' },
  { to: '/practice',label: 'Practice',      color: 'hover:bg-yellow-200' },
  { to: '/chat',    label: 'Ask Questions', color: 'hover:bg-blue-200' },
];

const colorMap = {
  'Home': 'bg-gray-500 text-white',
  'Modules': 'bg-green-500 text-white',
  'Practice': 'bg-yellow-500 text-white',
  'Ask Questions': 'bg-blue-500 text-white',
}

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 p-4 h-full">
      <h2 className="text-xl font-bold mb-6">AI Study Buddy</h2>
      <ul className="space-y-2">
        {links.map(({ to, label, color }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `block py-2 px-4 rounded transition ${color} ${
                  isActive ? colorMap[label] : 'text-gray-700'
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
