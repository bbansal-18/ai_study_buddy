/**
 * main.jsx
 *
 * Entry point for the React frontend application.
 * - Loads the root <App /> component.
 * - Wraps it with <BrowserRouter> to enable client-side routing.
 * - Attaches the React app to the HTML element with id="root".
 * 
 * @author bbansal-18
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // Enables URL-based routing
import App from './App'; // Main application component
import './index.css'; // Global styles

// Create a root container and render the application
ReactDOM.createRoot(document.getElementById('root')).render(
  // <BrowserRouter> enables navigation between pages without reloading the browser
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

