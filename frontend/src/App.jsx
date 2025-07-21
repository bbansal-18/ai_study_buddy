/**
 * App.jsx
 *
 * This is the root component of the React application.
 * It defines the layout and client-side routes using React Router.
 *
 * Layout:
 * - Sidebar (navigation) is fixed on the left.
 * - Main content area on the right changes based on the URL route.
 * 
 * @author bbansal-18
 */

import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Importing page components
import Home from './pages/Home';
import Learn from './pages/Learn';
import PracticeList from './pages/PracticeList';
import PracticeDetail from './pages/ProblemDetail';
import NotFound from './pages/NotFound';

// Importing UI components
import ChatBox from './components/ChatBox';
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    // Full-screen flex container: Sidebar on left, content on right
    <div className="flex h-screen">
      
      {/* Persistent sidebar for navigation */}
      <Sidebar />

      {/* Main content area, scrollable if content overflows vertically */}
      <div className="flex-1 p-4 overflow-y-auto">

        {/* Define client-side routes for each screen */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/practice" element={<PracticeList />} />
          <Route path="/practice/:id" element={<PracticeDetail />} />
          <Route path="/chat" element={<ChatBox />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
