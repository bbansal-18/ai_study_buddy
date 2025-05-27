import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Learn from './pages/Learn';
import Practice from './pages/Practice';
import ChatBox from './components/ChatBox';
import NotFound from './pages/NotFound';
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/practice" element={<Practice />} />
          <Route path="/chat" element={<ChatBox />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
