/**
 * src/components/TextWithInlineQuotes.jsx
 *
 * Provides a component to render text paragraphs with special handling for:
 * - Inline backtick code spans wrapped in <code> elements.
 * - Single-quoted segments wrapped in styled <span> elements.
 *
 * Exported Functions:
 *   - TextWithInlineQuotes({ text }): React component
 *
 *
 * TextWithInlineQuotes:
 *   - Input: text (string) potentially containing `code` and 'quoted' spans
 *   - Output: <p> JSX element with mixed text, <code>, and <span> children
 *   - Approach: first splits on backtick code spans, then processes trailing text for single quotes.
 *
 * Helpers:
 *   splitSingleQuotes:
 *   - Input: str (string) containing single-quoted segments
 *   - Output: array of strings and <span> elements for quoted text
 *   - Approach: uses regex to locate 'quoted' text and join plain segments.
 * 
 * @author bbansal-18
 */

import React from 'react';
import PropTypes from 'prop-types';

/**
 * Splits a string on single-quoted segments and wraps them in styled <span> elements.
 *
 * @param {string} str - Input string with 'quoted' segments
 * @returns {Array<string | JSX.Element>} Mixed array of plain strings and <span> elements
 */
function splitSingleQuotes(str) {
  const parts = [];
  const regex = /'([^']+)'/g;
  let lastIndex = 0;
  let matchIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    const [full, quoted] = match;
    const start = match.index;

    if (start > lastIndex) {
      parts.push(str.slice(lastIndex, start));
    }

    parts.push(
      <span key={`q-${matchIndex}`} className="bg-gray-300 text-gray-900 px-2 rounded">
        {quoted}
      </span>
    );

    lastIndex = start + full.length;
    matchIndex++;
  }

  if (lastIndex < str.length) {
    parts.push(str.slice(lastIndex));
  }

  return parts;
}

/**
 * Renders a paragraph of text with inline handling for backtick code spans and single quotes.
 *
 * @param {Object} props
 * @param {string} props.text - Raw text containing `code` spans and 'quoted' parts
 * @returns {JSX.Element} <p> element with mixed children nodes
 */
export function TextWithInlineQuotes({ text }) {
  const nodes = [];
  let lastIndex = 0;
  const codeRegex = /`([^`]+)`/g;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    const [full, code] = match;
    const idx = match.index;

    if (idx > lastIndex) {
      nodes.push(text.slice(lastIndex, idx));
    }

    nodes.push(
      <code key={`code-${idx}`} className="bg-gray-300 text-gray-900 font-mono px-2 rounded">
        {code}
      </code>
    );

    lastIndex = idx + full.length;
  }

  const tail = text.slice(lastIndex);
  if (tail) {
    nodes.push(...splitSingleQuotes(tail));
  }

  return <p className="my-2">{nodes}</p>;
}

TextWithInlineQuotes.propTypes = {
  text: PropTypes.string.isRequired,
};
