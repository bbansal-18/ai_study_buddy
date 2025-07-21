/**
 * src/pages/Learn.jsx
 *
 * Renders the Learn module landing page, intended to host interactive
 * course content and tutorials on various computer science topics.
 *
 * This module will be expanded to include:
 *   - Structured lessons
 *   - Code examples and interactive exercises
 *   - Multimedia explanations of core CS concepts
 *
 * @author bbansal-18
 */

import React from 'react';

/**
 * Learn component
 *
 * @returns {JSX.Element} A simple placeholder for the Learn module.
 */
export default function Learn() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">
        Welcome to the Learn Module!
      </h1>
      <p className="mt-2 text-gray-700">
        This section will host special courses and tutorials for exploring
        interesting computer science ideas, complete with examples and
        interactive content. (TODO: implement course listings)
      </p>
    </div>
  );
}
