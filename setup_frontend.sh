#!/bin/bash

# Exit on error
echo "Setting up AI Study Buddy frontend..."
set -e

# Create directory structure
mkdir -p frontend/{public,src/components,src/pages}
cd frontend

# Create package.json
cat > package.json << 'EOF'
{
  "name": "ai-study-buddy-frontend",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0"
  },
  "devDependencies": {
    "vite": "^4.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "tailwindcss": "^3.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0"
  }
}
EOF

# Create Vite config
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
});
EOF

# Create Tailwind and PostCSS configs
cat > tailwind.config.js << 'EOF'
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
EOF

cat > postcss.config.js << 'EOF'
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
EOF

# Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AI Study Buddy</title>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
EOF

# Create main.jsx and App.jsx
mkdir -p src
cat > src/main.jsx << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
EOF

cat > src/App.jsx << 'EOF'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import Sidebar from './components/Sidebar';

export default function App() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
EOF

# Create CSS
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;
EOF

# Create components
mkdir -p src/components
cat > src/components/Sidebar.jsx << 'EOF'
import React from 'react';

export default function Sidebar() {
  return (
    <div className="w-64 bg-gray-100 p-4">
      <h2 className="text-xl font-bold mb-4">Topics</h2>
      <ul className="space-y-2">
        <li>DSA</li>
        <li>Python</li>
      </ul>
    </div>
  );
}
EOF

cat > src/components/ChatBox.jsx << 'EOF'
import React, { useState } from 'react';

export default function ChatBox() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: call /parse then /chat endpoints
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-2 bg-white rounded shadow">
        {response ? <pre>{JSON.stringify(response, null, 2)}</pre> : <p>Ask me anything...</p>}
      </div>
      <form onSubmit={handleSubmit} className="mt-4 flex">
        <input
          type="text"
          className="flex-1 border rounded px-2 py-1 mr-2"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your question..."
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">
          Send
        </button>
      </form>
    </div>
  );
}
EOF

# Create pages
mkdir -p src/pages
cat > src/pages/Home.jsx << 'EOF'
import React from 'react';
import ChatBox from '../components/ChatBox';

export default function Home() {
  return (
    <div className="h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-4">AI Study Buddy</h1>
      <div className="flex-1">
        <ChatBox />
      </div>
    </div>
  );
}
EOF

cat > src/pages/NotFound.jsx << 'EOF'
import React from 'react';

export default function NotFound() {
  return <h1 className="text-3xl">404 - Page Not Found</h1>;
}
EOF

# Return to project root
cd ..

echo "Frontend scaffold created successfully in ./frontend"
