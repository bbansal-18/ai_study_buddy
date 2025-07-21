/**
 * src/components/formatChatResponse.jsx
 *
 * Provides utilities to transform raw AI response text into React nodes,
 * handling fenced code blocks and inline-quoted segments for display in chat UI.
 *
 * Exported Functions:
 *   - parseSegments(text): Array<{ type: 'text'|'code', content: string, lang?: string }>
 *   - formatChatResponse(text): React.ReactNode[]
 *
 * parseSegments:
 *   - Input: raw string possibly containing triple-backtick code blocks
 *   - Output: ordered array of segment objects indicating text or code
 *   - Approach: uses a global regex to locate code blocks and split text
 *
 * formatChatResponse:
 *   - Input: raw response text
 *   - Output: array of React elements (<p> and <pre><code>) ready for rendering
 *   - Approach: maps segments to appropriate React components, wrapping text in
 *     <TextWithInlineQuotes> and code blocks in styled <pre> blocks.
 *
 * @author bbansal-18
 */

import React from 'react';
import { TextWithInlineQuotes } from './TextWithInlineQuotes';

/**
 * Split raw response into text and code segments.
 *
 * @param {string} text - The AI response possibly containing ```lang ... ``` blocks
 * @returns {Array<Object>} segments - List of segments:
 *   - { type: 'text', content: string }
 *   - { type: 'code', content: string, lang: string }
 */
export function parseSegments(text) {
  const segments = [];
  let lastIndex = 0;
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const [fullMatch, lang = '', codeContent] = match;
    const idx = match.index;

    if (idx > lastIndex) {
      segments.push({ type: 'text', content: text.slice(lastIndex, idx) });
    }

    segments.push({ type: 'code', lang, content: codeContent });
    lastIndex = idx + fullMatch.length;
  }

  if (lastIndex < text.length) {
    segments.push({ type: 'text', content: text.slice(lastIndex) });
  }

  return segments;
}

/**
 * Convert raw AI response text into an array of React nodes.
 *
 * @param {string} text - Raw response string
 * @returns {React.ReactNode[]} nodes - Array of <TextWithInlineQuotes> and <pre><code> elements
 */
export function formatChatResponse(text) {
  const segments = parseSegments(text);
  return segments.map((seg, idx) => {
    if (seg.type === 'code') {
      const label = seg.lang || 'plaintext';
      return (
        <pre key={idx} className="my-4 overflow-auto bg-gray-200 rounded">
          <div className="px-2 py-1 bg-gray-800 text-xs text-gray-200">{label}</div>
          <code className={`block p-4 language-${seg.lang} text-gray-800`}> {seg.content} </code>
        </pre>
      );
    }

    return <TextWithInlineQuotes key={idx} text={seg.content} />;
  });
}
