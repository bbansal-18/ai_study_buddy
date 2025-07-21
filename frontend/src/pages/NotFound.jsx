/**
 * src/pages/NotFound.jsx
 *
 * Renders a fallback UI for undefined routes, indicating a 404 error.
 *
 * Exports:
 *   - NotFound(): React component for 404 error page
 *
 * @author bbansal-18
 */

import React from 'react';

/**
 * NotFound component
 *
 * @returns {JSX.Element} A simple 404 error message
 */
export default function NotFound() {
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-3xl font-semibold">404 - Page Not Found</h1>
    </div>
  );
}
